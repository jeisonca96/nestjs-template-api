import { Test, TestingModule } from '@nestjs/testing';
import { ExampleController } from './example.controller';
import { ExampleService } from '../services/example.service';
import { LoggerBuilderService } from '../../core-services/logger/logger-builder.service';
import { CustomLoggerService } from '../../core-services/logger/custom-logger.service';

describe('ExampleController', () => {
  let exampleController: ExampleController;
  let exampleService: ExampleService;
  let loggerBuilder: LoggerBuilderService;
  let customLoggerService: CustomLoggerService;

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
          provide: LoggerBuilderService,
          useValue: {
            build: jest.fn().mockReturnValue({
              log: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    exampleController = module.get<ExampleController>(ExampleController);
    exampleService = module.get<ExampleService>(ExampleService);
    loggerBuilder = module.get<LoggerBuilderService>(LoggerBuilderService);
    customLoggerService = loggerBuilder.build(ExampleController.name);
  });

  it('should be defined', () => {
    expect(exampleController).toBeDefined();
  });

  describe('getHello', () => {
    it('should return a message', () => {
      const result = { message: 'Hello World!' };
      jest.spyOn(exampleService, 'getHello').mockReturnValue(result);

      expect(exampleController.getHello()).toBe(result);
      expect(customLoggerService.log).toHaveBeenCalledWith('Here get hello!');
    });
  });
});
