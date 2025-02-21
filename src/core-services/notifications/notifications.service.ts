import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './repositories/notification.repository';
import { EmailRepository } from './repositories/email.repository';
import { WhatsappRepository } from './repositories/whatsapp.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly pushRepository: NotificationRepository,
    private readonly emailRepository: EmailRepository,
    private readonly whatsappRepository: WhatsappRepository,
  ) {}

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
}
