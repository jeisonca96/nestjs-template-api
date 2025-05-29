import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { google, calendar_v3 } from 'googleapis';
import { NotificationsConfig } from '../notifications.config';
import { OAuth2Client } from 'google-auth-library';
import {
  CustomLogger,
  CustomLoggerService,
} from 'src/core-services/logger/custom-logger.service';
import { FileTokenProvider } from './file-token.provider';
import { AlertsService } from 'src/core-services/alerts/alerts.service';

export interface GoogleEvent {
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  mode: 'virtual' | 'in-person';
  locationDetails?: {
    name: string;
    address?: string;
  };
  attendees?: { email: string }[];
  reminders?: {
    useDefault?: boolean;
    overrides?: { method: 'email' | 'popup'; minutes: number }[];
  };
}

@Injectable()
export class GoogleCalendarRepository {
  logger: CustomLogger;
  private oAuth2Client: OAuth2Client;
  private calendar: calendar_v3.Calendar;
  private readonly SCOPES = ['https://www.googleapis.com/auth/calendar'];

  constructor(
    private readonly customLoggerService: CustomLoggerService,
    private readonly config: NotificationsConfig,
    private readonly tokenProvider: FileTokenProvider,
    @Inject(forwardRef(() => AlertsService))
    private readonly alertsService: AlertsService,
  ) {
    this.logger = this.customLoggerService.createLogger(
      GoogleCalendarRepository.name,
    );
    this.initializeClient();
  }

  private initializeClient() {
    this.oAuth2Client = new google.auth.OAuth2(
      this.config.googleCalendarConfig.clientId,
      this.config.googleCalendarConfig.clientSecret,
      this.config.googleCalendarConfig.redirectUri,
    );

    this.calendar = google.calendar({
      version: 'v3',
      auth: this.oAuth2Client,
    });
  }

  /**
   * Generate Google Calendar authorization URL
   * @returns The authorization URL to redirect to
   */
  generateAuthUrl(): string {
    this.logger.log('Generating Google Calendar auth URL');
    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES,
      prompt: 'consent',
    });
  }

  /**
   * Handle the authorization callback and save tokens
   * @param code Authorization code from Google
   */
  async handleAuthCallback(code: string): Promise<void> {
    try {
      this.logger.log('Processing Google auth callback code');

      if (!code) {
        this.logger.error('No authorization code received');
        throw new Error('No authorization code received');
      }

      const { tokens } = await this.oAuth2Client.getToken(code);
      this.logger.log('Successfully obtained Google Calendar tokens');

      await this.tokenProvider.saveToken({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date,
      });

      this.logger.log('Google Calendar tokens saved successfully');
    } catch (error) {
      this.logger.error(
        `Error handling Google auth callback: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async refreshTokenIfNeeded() {
    try {
      const token = await this.tokenProvider.getToken();
      this.oAuth2Client.setCredentials(token);

      if (token.expiry_date < Date.now() - 60000) {
        const { credentials } = await this.oAuth2Client.refreshAccessToken();

        if (credentials.access_token) {
          await this.tokenProvider.saveToken({
            access_token: credentials.access_token,
            refresh_token: credentials.refresh_token || token.refresh_token,
            expiry_date: credentials.expiry_date,
          });
          this.oAuth2Client.setCredentials(credentials);
        }
      }
    } catch (error) {
      this.logger.error('Error refreshing Google Calendar token', error.stack);
      if (error.message.includes('invalid_grant')) {
        this.logger.error(
          'Invalid grant error detected. Clearing tokens and requiring reauthentication.',
        );
        this.alertsService.alert({
          title: 'Google Calendar Reauthentication Required',
          description: 'Google Calendar token is invalid or expired.',
          severity: 'critical',
          actionLink: this.config.googleCalendarConfig.generateAuthUrl,
          actionLinkText: 'Reauthenticate Google Calendar',
          additionalInfo: 'User needs to reauthenticate with Google Calendar.',
          metadata: { error: error.message },
        });
        throw new Error('REAUTHENTICATION_REQUIRED');
      }
      this.alertsService.alert({
        title: 'Google Calendar Token Refresh Error',
        description: 'Failed to refresh Google Calendar token.',
        severity: 'critical',
        actionLink: this.config.googleCalendarConfig.generateAuthUrl,
        actionLinkText: 'Reauthenticate Google Calendar',
        additionalInfo: 'User needs to reauthenticate with Google Calendar.',
        metadata: { error: error.message },
      });
      throw error;
    }
  }

  async createEvent(
    calendarId: string,
    event: GoogleEvent,
    conferenceDataVersion = 1,
  ): Promise<calendar_v3.Schema$Event> {
    try {
      await this.refreshTokenIfNeeded();

      const requestBody: calendar_v3.Schema$Event = {
        summary: event.summary,
        description: event.description,
        start: {
          dateTime: event.start.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: event.end.toISOString(),
          timeZone: 'UTC',
        },
        attendees: event.attendees,
        reminders: event.reminders,
      };

      if (event.mode === 'in-person' && event.locationDetails) {
        requestBody.location = `${event.locationDetails.name}${
          event.locationDetails.address
            ? `, ${event.locationDetails.address}`
            : ''
        }`;
      }

      if (event.mode === 'virtual') {
        requestBody.conferenceData = {
          createRequest: {
            requestId: Math.random().toString(36).substring(7),
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        };
      }

      const response = await this.calendar.events.insert({
        calendarId,
        requestBody,
        conferenceDataVersion: event.mode === 'virtual' ? 1 : 0,
      });

      return response.data;
    } catch (error) {
      this.logger.error('Error creating Google Calendar event', error.stack);
      throw new Error(`Failed to create calendar event: ${error.message}`);
    }
  }

  async updateEvent(
    calendarId: string,
    eventId: string,
    updates: Partial<GoogleEvent>,
  ): Promise<calendar_v3.Schema$Event> {
    try {
      await this.refreshTokenIfNeeded();

      const requestBody: calendar_v3.Schema$Event = {
        ...updates,
        start: updates.start
          ? { dateTime: updates.start.toISOString(), timeZone: 'UTC' }
          : undefined,
        end: updates.end
          ? { dateTime: updates.end.toISOString(), timeZone: 'UTC' }
          : undefined,
      };

      const response = await this.calendar.events.patch({
        calendarId,
        eventId,
        requestBody,
      });

      return response.data;
    } catch (error) {
      this.logger.error('Error updating Google Calendar event', error.stack);
      throw new Error(`Failed to update calendar event: ${error.message}`);
    }
  }

  async cancelEvent(calendarId: string, eventId: string): Promise<void> {
    try {
      await this.refreshTokenIfNeeded();

      await this.calendar.events.delete({
        calendarId,
        eventId,
      });
    } catch (error) {
      this.logger.error('Error canceling Google Calendar event', error.stack);
      throw new Error(`Failed to cancel calendar event: ${error.message}`);
    }
  }
}
