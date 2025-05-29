import {
  Controller,
  Get,
  Res,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiTagsEnum } from 'src/constants';
import { Response } from 'express';
import {
  CustomLogger,
  CustomLoggerService,
} from '../logger/custom-logger.service';
import { NotificationsService } from './notifications.service';

@Controller('notification')
@ApiTags(ApiTagsEnum.Notification)
export class NotificationController {
  private logger: CustomLogger;

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly customLoggerService: CustomLoggerService,
  ) {
    this.logger = this.customLoggerService.createLogger(
      NotificationController.name,
    );
  }

  @Get('calendar/auth')
  @ApiOperation({
    summary: 'Generate and redirect to Google Calendar auth URL',
  })
  @ApiResponse({ status: 302, description: 'Redirects to Google auth page' })
  async generateAuthUrl(@Res() res: Response) {
    this.logger.log('Controller: Generating Google Calendar auth URL');
    const authUrl = this.notificationsService.generateCalendarAuthUrl();
    this.logger.log(`Controller: Redirecting to Google auth URL: ${authUrl}`);
    return res.redirect(authUrl);
  }

  @Get('calendar/callback')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Handle Google Calendar authorization callback' })
  @ApiResponse({ status: 204, description: 'Authorization successful' })
  async handleAuthCallback(@Query('code') code: string) {
    this.logger.log('Controller: Received Google Calendar auth callback');

    if (!code) {
      this.logger.error('Controller: No authorization code received');
      throw new Error('No authorization code received');
    }

    await this.notificationsService.handleCalendarAuthCallback(code);
    this.logger.log('Controller: Google Calendar authorization completed');
    return;
  }
}
