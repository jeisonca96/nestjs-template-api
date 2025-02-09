import { json } from 'express';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppConfig } from './config/app.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BuildApiDocs } from './apidocs';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  logger.log('Initializing application...');

  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfig);
  const limit = appConfig.bodyLimit;
  const port = appConfig.port;

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  logger.log('Setting custom limit for JSON body parser', { limit });
  app.use(json({ limit }));

  const { config, route } = BuildApiDocs(appConfig.baseUrl);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(route, app, document);

  await app.listen(port);
  logger.log(`Application is running on port ${port}`);
}

bootstrap();
