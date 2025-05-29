import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NotificationRepository } from './repositories/notification.repository';
import { EmailRepository } from './repositories/email.repository';
import { WhatsappRepository } from './repositories/whatsapp.repository';
import {
  GoogleCalendarRepository,
  GoogleEvent,
} from './repositories/google-calendar.repository';
import {
  CustomLogger,
  CustomLoggerService,
} from '../logger/custom-logger.service';
import { AlertsService } from '../alerts/alerts.service';

@Injectable()
export class NotificationsService {
  logger: CustomLogger;
  constructor(
    private readonly customLoggerService: CustomLoggerService,
    private readonly pushRepository: NotificationRepository,
    private readonly emailRepository: EmailRepository,
    private readonly whatsappRepository: WhatsappRepository,
    private readonly googleCalendarRepository: GoogleCalendarRepository,
    @Inject(forwardRef(() => AlertsService))
    private readonly alertsService: AlertsService,
  ) {
    this.logger = this.customLoggerService.createLogger(
      NotificationsService.name,
    );
  }

  async sendNotification(
    clientId: string,
    type: string,
    title: string,
    message: string,
    metadata?: Record<string, any>,
  ) {
    return this.pushRepository.create(clientId, type, title, message, metadata);
  }

  /**
   * Sends an email using the specified template and context.
   *
   * @param {string} to - The recipient's email address.
   * @param {string} subject - The subject of the email.
   * @param {string} templatePath - The path to the email template.
   * @param {Record<string, any>} [context] - Optional context to be used in the email template.
   * @returns {Promise<void>} A promise that resolves when the email has been sent.
   * @example
   * import * as path from 'path';
   * const context = {
   *   name: user.fullName,
   *   verifyLink: `https://example.com/verify?token=${user.verificationToken}`,
   * };
   * const templatePath = path.join(__dirname, 'emailTemplates', 'welcome.hbs');
   * await this.emailRepository.sendEmail(user.email, 'Welcome to Example', templatePath, context);
   */
  async sendEmail(
    to: string,
    subject: string,
    templatePath: string,
    context?: Record<string, any>,
  ) {
    return this.emailRepository.sendEmail(to, subject, templatePath, context);
  }

  async sendWhatsappMessage(to: string, message: string) {
    return this.whatsappRepository.sendMessage(to, message);
  }

  async sendWhatsappMessageToTemplate(
    to: string,
    templateSid: string,
    variables: Record<string, string>,
  ) {
    try {
      return await this.whatsappRepository.sendMessageToTemplate(
        to,
        templateSid,
        variables,
      );
    } catch (error) {
      this.logger.error(
        'Failed to send WhatsApp message to template',
        error.stack,
      );
      this.alertsService.alert({
        title: 'WhatsApp Message Error',
        description: `Failed to send WhatsApp message to template: ${error.message}`,
        severity: 'error',
        additionalInfo: error.stack,
        metadata: { error: error.message },
      });
      throw error;
    }
  }

  /**
   * Generates a Google Calendar authorization URL
   * @returns The authorization URL to redirect to
   */
  generateCalendarAuthUrl(): string {
    this.logger.log('Generating Google Calendar auth URL');
    return this.googleCalendarRepository.generateAuthUrl();
  }

  /**
   * Handles the Google Calendar authorization callback
   * @param code The authorization code from Google
   */
  async handleCalendarAuthCallback(code: string): Promise<void> {
    this.logger.log('Processing Google Calendar auth callback');
    return this.googleCalendarRepository.handleAuthCallback(code);
  }

  /**
   * Creates a Google Calendar event and sends notifications
   * @param calendarId Target calendar ID (use 'primary' for main calendar)
   * @param event Event details
   * @returns Created event details
   */
  async createCalendarEvent(calendarId: string, event: GoogleEvent) {
    try {
      const createdEvent = await this.googleCalendarRepository.createEvent(
        calendarId,
        event,
      );

      return createdEvent;
    } catch (error) {
      this.logger.error('Failed to create calendar event', error.stack);
      throw error;
    }
  }

  /**
   * Updates an existing Google Calendar event
   * @param calendarId Target calendar ID
   * @param eventId ID of the event to update
   * @param updates Event updates
   * @param sendNotifications Whether to send update notifications
   * @returns Updated event details
   */
  async updateCalendarEvent(
    calendarId: string,
    eventId: string,
    updates: Partial<GoogleEvent>,
  ): Promise<any> {
    try {
      const updatedEvent = await this.googleCalendarRepository.updateEvent(
        calendarId,
        eventId,
        updates,
      );

      return updatedEvent;
    } catch (error) {
      this.logger.error('Failed to update calendar event', error.stack);
      throw error;
    }
  }

  /**
   * Cancels a Google Calendar event
   * @param calendarId Target calendar ID
   * @param eventId ID of the event to cancel
   * @param cancellationReason Reason for cancellation
   * @param sendNotifications Whether to send cancellation notifications
   */
  async cancelCalendarEvent(
    calendarId: string,
    eventId: string,
  ): Promise<void> {
    try {
      await this.googleCalendarRepository.cancelEvent(calendarId, eventId);
    } catch (error) {
      this.logger.error('Failed to cancel calendar event', error.stack);
      throw error;
    }
  }
}
