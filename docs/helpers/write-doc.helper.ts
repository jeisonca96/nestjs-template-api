/* eslint-disable no-console */
import * as fs from 'fs';
import { OpenAPIObject } from '@nestjs/swagger';

const DOCS_PATH = 'openapi';
const FILENAME = 'swagger.json';

export function writeDocs(document: OpenAPIObject) {
  try {
    createDirectory(DOCS_PATH);
    fs.writeFileSync(`${DOCS_PATH}/${FILENAME}`, JSON.stringify(document));
  } catch (error) {
    console.error(
      `❌ Oops! There was an error while writing the documentation file:\n`,
      error,
    );
    process.exit(1);
  }
}

function createDirectory(filePath: string) {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath);
  }
}
