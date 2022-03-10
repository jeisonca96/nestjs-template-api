import { Test } from '@nestjs/testing';
import { HealthController } from './controllers/health.controller';
import { HealthModule } from './health.module';

describe('HealthModule', () => {
  describe('forRoot', () => {
    it('instantiate health service without crashing', async () => {
      const module = await Test.createTestingModule({
        imports: [HealthModule],
      }).compile();

      expect(module.get(HealthController)).toBeDefined();
    });
  });
});
