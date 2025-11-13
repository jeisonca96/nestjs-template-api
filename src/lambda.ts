import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import {
  INestApplication,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { AppModule } from './app.module';
import { AppConfig } from './config/app.config';
import { SwaggerModule } from '@nestjs/swagger';
import { BuildApiDocs } from './apidocs';
import { Handler, Context, Callback } from 'aws-lambda';
const serverlessExpress = require('@codegenie/serverless-express');
import { json } from 'express';
const express = require('express');
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Environment } from './constants';

let cachedServer: Handler;

async function bootstrapServer(): Promise<Handler> {
  if (!cachedServer) {
    const logger = new Logger('Lambda');
    logger.log('Initializing Lambda application...');

    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);

    const app = await NestFactory.create(AppModule, adapter, {
      logger: ['error', 'warn', 'log'],
      bufferLogs: true,
    });

    const appConfig = app.get(AppConfig);
    const limit = appConfig.bodyLimit;

    // Configure app for Lambda
    configureApp(app, appConfig, limit);

    await app.init();

    logger.log('Lambda application initialized successfully');
    const server = serverlessExpress({ app: expressApp });
    cachedServer = server;
  }

  return cachedServer;
}

function configureApp(
  app: INestApplication,
  appConfig: AppConfig,
  limit: string,
): void {
  const logger = new Logger('LambdaConfig');

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

  // Security middleware - adjusted for Lambda
  if (process.env.NODE_ENV === Environment.Production) {
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
  }

  // Rate limiting - Lambda compatible
  const limiter = rateLimit({
    windowMs: appConfig.rateLimitWindow,
    max: appConfig.rateLimitMax,
    message: {
      message: 'Too many requests, please try again later.',
      code: 'TOO_MANY_REQUESTS',
      details: 'Too many requests from this IP, please try again later.',
      statusCode: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Use a store compatible with Lambda (in-memory for single instance)
    skipFailedRequests: false,
    skipSuccessfulRequests: false,
  });
  app.use(limiter);

  // CORS configuration
  app.enableCors({
    origin: appConfig.corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
    credentials: true,
  });

  logger.log('Setting custom limit for JSON body parser', { limit });
  app.use(json({ limit }));

  // Swagger documentation
  const { config, route } = BuildApiDocs(appConfig.baseUrl);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(route, app, document);
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  // AWS Lambda context reuse optimization
  context.callbackWaitsForEmptyEventLoop = false;

  const server = await bootstrapServer();
  return server(event, context, callback);
};
