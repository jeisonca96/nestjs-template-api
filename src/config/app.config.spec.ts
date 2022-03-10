import { AppConfig } from './app.config';
import { ConfigService } from '@nestjs/config';

jest.mock('@nestjs/config');

const mock = <T>(options: Partial<T>): T => {
  return jest.fn(() => options as T)();
};

describe('AppConfig', () => {
  describe('port', () => {
    it('should set port 3000 as default port', async () => {
      const configServiceMock = mock<ConfigService>({
        get: jest.fn(),
      });

      new AppConfig(configServiceMock).port;

      expect(configServiceMock.get).toHaveBeenCalledWith(
        expect.any(String),
        3000,
      );
    });

    it('should return port from the configuration service', async () => {
      const configServiceMock = mock<ConfigService>({
        get: jest.fn().mockReturnValue(3001),
      });

      const applicationConfiguration = new AppConfig(configServiceMock);

      expect(applicationConfiguration.port).toBe(3001);
    });
  });

  describe('bodyLimit', () => {
    it('should set bodyLimit 2mb as default', async () => {
      const configServiceMock = mock<ConfigService>({
        get: jest.fn(),
      });

      new AppConfig(configServiceMock).bodyLimit;

      expect(configServiceMock.get).toHaveBeenCalledWith(expect.any(String));
    });

    it('should return bodyLimit from the configuration service', async () => {
      const configServiceMock = mock<ConfigService>({
        get: jest.fn().mockReturnValue('3mb'),
      });

      const applicationConfiguration = new AppConfig(configServiceMock);

      expect(applicationConfiguration.bodyLimit).toBe('3mb');
    });
  });
});
