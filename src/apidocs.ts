import { DocumentBuilder } from '@nestjs/swagger';
import { ApiDescriptions } from './constants';

export function BuildApiDocs(baseUrl: string) {
  let builder = new DocumentBuilder()
    .setTitle('NestJS Template API')
    .setDescription('Documentation for NestJS Template API')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      in: 'header',
      bearerFormat: 'JWT',
    })
    .addServer(baseUrl, 'Base URL');

  Object.entries(ApiDescriptions).forEach(([tag, description]) => {
    builder = builder.addTag(tag, description);
  });

  return { config: builder.build(), route: 'api-docs' };
}
