import { DpEnvironment } from '../../src/dp-env';

export class OpenApiConfiguration {
  static getApiTitle(): string {
    return process.env.API_TITLE || 'NestJS Template API';
  }

  static getApiDescription(): string {
    return (
      process.env.API_DESCRIPTION ||
      'API for Microservice focused on generating the labels'
    );
  }

  static getPackageVersion(): string {
    return process.env.npm_package_version || '';
  }

  static getEnvironmentUrl(): string {
    switch (process.env.DP_ENVIRONMENT) {
      case DpEnvironment.LOCAL:
        return `http://localhost:${process.env.API_PORT || 3000}`;
      case DpEnvironment.PROD:
        return `https://nestjs-template-api/v1`;
      default:
        return `http://localhost:${process.env.API_PORT || 3000}`;
    }
  }
}
