import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { AlertsConfig } from './alerts.config';
import {
  CustomLogger,
  CustomLoggerService,
} from '../logger/custom-logger.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface AlertOptions {
  title: string;
  description: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
  additionalInfo?: string;
  actionLink?: string;
  actionLinkText?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class AlertsService {
  private logger: CustomLogger;

  constructor(
    private readonly alertsConfig: AlertsConfig,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
    private readonly customLoggerService: CustomLoggerService,
  ) {
    this.logger = this.customLoggerService.createLogger(AlertsService.name);
  }

  /**
   * Send an alert to the admin(s) via email
   *
   * @param options Alert content and options
   * @example
   * this.alertsService.alert({
   *   title: 'S3 Upload Failed',
   *   description: 'Failed to upload file to S3 bucket',
   *   severity: 'error',
   *   additionalInfo: `File key: ${key}, Attempt: ${attemptCount}`,
   *   metadata: { error: error.message, stack: error.stack, key }
   * });
   */
  async alert(options: AlertOptions): Promise<void> {
    try {
      const { title, description, severity = 'error' } = options;
      const adminEmail = this.alertsConfig.adminAlertEmail;

      if (!adminEmail) {
        this.logger.warn('No admin email configured, alert not sent');
        return;
      }

      this.logger.log(
        `Sending ${severity} alert to admin: ${title.substring(0, 30)}...`,
      );

      const templatePath = this.alertsConfig.adminAlertTemplatePath;
      const timestamp = new Date().toISOString();
      const environment = this.alertsConfig.environment;
      const currentYear = new Date().getFullYear();

      const context = {
        title,
        description,
        additionalInfo: options.additionalInfo,
        actionLink: options.actionLink,
        actionLinkText: options.actionLinkText || 'View Details',
        timestamp,
        environment,
        traceId: this.getTraceId(),
        severity,
        currentYear,
      };

      const subject = `[${environment.toUpperCase()}] [${severity.toUpperCase()}] ${title}`;

      await this.notificationsService.sendEmail(
        adminEmail,
        subject,
        templatePath,
        context,
      );

      this.logger.log(`Alert sent to admin ${adminEmail} successfully`);
    } catch (error) {
      this.logger.error(
        `Failed to send alert email: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Send an alert about a critical system error
   */
  async criticalError(title: string, error: Error): Promise<void> {
    return this.alert({
      title,
      description: `A critical system error has occurred: ${error.message}`,
      severity: 'critical',
      additionalInfo: error.stack,
      metadata: { error: error.message, stack: error.stack },
    });
  }

  /**
   * Get the trace ID from the AsyncLocalStorage if available
   */
  private getTraceId(): string | undefined {
    try {
      const store = this.logger['asyncLocalStorage'].getStore();
      const request = store?.get('request');
      return request?.['traceId'];
    } catch (error) {
      return undefined;
    }
  }
}
