import { AppConfigService } from '../config';
import { HealthcheckService } from './healthcheck.service';

describe('HealthcheckService', () => {
  let healthcheckService: HealthcheckService;
  let mockAppConfigService: AppConfigService;

  beforeEach(() => {
    mockAppConfigService = {
      config: { appName: 'TestApp', appEnv: 'test', version: 'version' },
    } as unknown as AppConfigService;
    healthcheckService = new HealthcheckService(mockAppConfigService);
  });

  it('should return correct healthcheck status', async () => {
    const result = await healthcheckService.getStatus();
    expect(result.service).toBe('TestApp');
    expect(result.environment).toBe('test');
    expect(typeof result.uptime).toBe('number');
    expect(typeof result.timestamp).toBe('number');
    expect(result.maintenance).toBe(false);
    expect(result.version).toEqual('version');
  });

  it('should set uptime and timestamp dynamically', async () => {
    const before = Date.now();
    const result = await healthcheckService.getStatus();
    expect(result.timestamp).toBeGreaterThanOrEqual(before);
    expect(result.uptime).toBeGreaterThanOrEqual(0);
  });
});
