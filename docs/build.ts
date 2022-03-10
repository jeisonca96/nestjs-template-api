import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { OpenApiHelper } from './helpers/open-api.helper';
import { DocsModule } from './docs.module';
import { writeDocs } from './helpers/write-doc.helper';

async function buildDocs() {
  dotenv.config();
  const app = await NestFactory.create(DocsModule);
  const swagger = OpenApiHelper.buildSwaggerJson(app);
  writeDocs(swagger);

  app.close();
}

buildDocs();
