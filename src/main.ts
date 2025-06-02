import { json } from 'express';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppConfig } from './config/app.config';
import { SwaggerModule } from '@nestjs/swagger';
import { BuildApiDocs } from './apidocs';
import { GlobalExceptionFilter } from './core-services/exceptions/filters';
import { AlertsService } from './core-services/alerts/alerts.service';
import { CustomLoggerService } from './core-services/logger/custom-logger.service';
import { SanitizationInterceptor } from './core-services/validation/sanitization.interceptor';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  logger.log('Initializing application...');

  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfig);
  const limit = appConfig.bodyLimit;
  const port = appConfig.port;

  // Enhanced validation and sanitization
  logger.log('Configuring global validation pipes...');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: appConfig.isProduction,
      validationError: {
        target: false,
        value: false,
      },
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          value: error.value,
          constraints: error.constraints,
        }));
        return new Error(`Validation failed: ${JSON.stringify(result)}`);
      },
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Security middleware
  logger.log('Configuring security middleware...');
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }),
  );

  // Rate limiting middleware
  const limiter = rateLimit({
    windowMs: appConfig.rateLimitWindow,
    max: appConfig.rateLimitMax,
    message: {
      error: 'Too many requests from this IP, please try again later.',
      statusCode: 429,
      timestamp: new Date().toISOString(),
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  app.enableCors({
    origin: appConfig.corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  const alertsService = app.get(AlertsService);
  const loggerService = app.get(CustomLoggerService);
  app.useGlobalFilters(new GlobalExceptionFilter(alertsService, loggerService));

  // Apply global sanitization interceptor
  logger.log('Configuring global sanitization interceptor...');
  app.useGlobalInterceptors(new SanitizationInterceptor());

  logger.log('Setting custom limit for JSON body parser', { limit });
  app.use(json({ limit }));

  const { config, route } = BuildApiDocs(appConfig.baseUrl);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(route, app, document);

  await app.listen(port);
  logger.log(`Application is running on port ${port}`);
}

bootstrap();
