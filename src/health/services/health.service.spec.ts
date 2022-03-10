import { HealthService } from './health.service';

describe('ServerIndicator', () => {
  describe('check', () => {
    it('should return status up', async () => {
      const healthService = new HealthService();
      const returned = healthService.check('server');
      expect(returned.server.status).toEqual('up');
      expect(returned.server.version).toBeDefined();
      expect(returned.server.utc).toBeDefined();
      expect(returned.server.local).toBeDefined();
    });
  });
});
