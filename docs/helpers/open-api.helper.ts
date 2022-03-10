import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestjsTemplateApiTags } from '../../src/constants';
import { OpenApiConfiguration } from '../configuration/open-api.configuration';

export class OpenApiHelper {
  static buildSwaggerJson(app: INestApplication) {
    let options = new DocumentBuilder().setTitle(
      OpenApiConfiguration.getApiTitle(),
    );
    if (OpenApiConfiguration.getApiDescription()) {
      options = options.setDescription(
        OpenApiConfiguration.getApiDescription(),
      );
    }
    if (OpenApiConfiguration.getPackageVersion()) {
      options = options.setVersion(OpenApiConfiguration.getPackageVersion());
    }
    options.setLicense('MIT', null);
    options.addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      in: 'header',
      bearerFormat: 'JWT',
    });

    Object.entries(NestjsTemplateApiTags).forEach(([tag, description]) => {
      options.addTag(tag, description);
    });

    options.addServer(
      OpenApiConfiguration.getEnvironmentUrl(),
      'Server for current environment',
    );

    return SwaggerModule.createDocument(app, options.build());
  }
}
