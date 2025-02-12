import { Test, TestingModule } from '@nestjs/testing';
import { ExampleController } from './example.controller';
import { ExampleService } from '../services/example.service';
import { CustomLoggerService } from '../../core-services/logger/custom-logger.service';

describe('ExampleController', () => {
  let exampleController: ExampleController;
  let exampleService: ExampleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExampleController],
      providers: [
        {
          provide: ExampleService,
          useValue: {
            getHello: jest.fn().mockReturnValue({ message: 'Hello World!' }),
          },
        },
        {
          provide: CustomLoggerService,
          useValue: {
            createLogger: jest.fn().mockReturnValue({
              log: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    exampleController = module.get<ExampleController>(ExampleController);
    exampleService = module.get<ExampleService>(ExampleService);
  });

  it('should be defined', () => {
    expect(exampleController).toBeDefined();
  });

  describe('getHello', () => {
    it('should return a message', () => {
      const result = { message: 'Hello World!' };
      jest.spyOn(exampleService, 'getHello').mockReturnValue(result);

      expect(exampleController.getHello()).toBe(result);
      expect(exampleService.getHello).toHaveBeenCalled();
    });

    it('should log a message', () => {
      const logger = exampleController['logger'];
      exampleController.getHello();
      expect(logger.log).toHaveBeenCalledWith('Here get hello!');
    });
  });
});
