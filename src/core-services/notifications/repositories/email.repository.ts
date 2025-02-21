// src/notifications/repositories/email.repository.ts
import { Injectable } from '@nestjs/common';
import { NotificationsConfig } from '../notifications.config';
import * as nodemailer from 'nodemailer';
import { TemplateHelper } from '../template.helper';
import * as fs from 'fs';

@Injectable()
export class EmailRepository {
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: NotificationsConfig) {
    this.transporter = nodemailer.createTransport({
      host: config.emailConfig.host,
      port: config.emailConfig.port,
      secure: config.emailConfig.secure,
      auth: config.emailConfig.auth,
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    templatePath: string,
    context: Record<string, any>,
  ): Promise<void> {
    try {
      const html = TemplateHelper.compileTemplate(templatePath, context);
      const textPath = templatePath.replace('.hbs', '.text.hbs');
      const text = fs.existsSync(textPath)
        ? TemplateHelper.compileTemplate(textPath, context)
        : null;

      await this.transporter.sendMail({
        from: this.config.emailConfig.from,
        to,
        subject,
        text: text || html.replace(/<[^>]+>/g, ''),
        html,
      });
    } catch (error) {
      throw new Error(`Failed to send templated email: ${error.message}`);
    }
  }
}
