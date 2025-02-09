import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { GenerateApiKeyRequestDto, RegisterRequestDto } from '../dtos/auth.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            generateApiKey: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should call authService.register with correct parameters', async () => {
      const registerDto: RegisterRequestDto = {
        username: 'test',
        password: 'test',
      };
      await authController.register(registerDto);
      expect(authService.register).toHaveBeenCalledWith('test', 'test');
    });
  });

  describe('login', () => {
    it('should call authService.login with correct user', async () => {
      const request = { user: { username: 'test' } } as any;
      await authController.login(request);
      expect(authService.login).toHaveBeenCalledWith(request.user);
    });
  });

  describe('generateApiKey', () => {
    it('should throw UnauthorizedException if user is not admin', async () => {
      const request = { user: { role: 'user' } } as any;
      const generateApiKeyDto: GenerateApiKeyRequestDto = { name: 'test' };
      await expect(
        authController.generateApiKey(generateApiKeyDto, request),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should call authService.generateApiKey with correct parameters if user is admin', async () => {
      const request = { user: { role: 'admin', _id: '123' } } as any;
      const generateApiKeyDto: GenerateApiKeyRequestDto = { name: 'test' };
      authService.generateApiKey = jest
        .fn()
        .mockResolvedValue({ apiKey: 'apiKey', secret: 'secret' });
      const result = await authController.generateApiKey(
        generateApiKeyDto,
        request,
      );
      expect(authService.generateApiKey).toHaveBeenCalledWith('test', '123');
      expect(result).toEqual({ apiKey: 'apiKey', secret: 'secret' });
    });
  });

  describe('validateApiKey', () => {
    it('should return a valid message', async () => {
      const result = await authController.validateApiKey();
      expect(result).toEqual({ message: 'API key and secret are valid' });
    });
  });
});
