import { AppConfigService } from 'src/config/app-config.service';
import { StudioServiceAuthStrategyService } from './service-auth-strategy.service';

describe('StudioServiceAuthStrategyService', () => {
  it('should instantiate with serviceApiSignature from appConfigService', () => {
    const appConfigService = {
      authConfig: { serviceApiSignature: 'sig' },
    } as unknown as AppConfigService;
    const service = new StudioServiceAuthStrategyService(appConfigService);
    expect(service).toBeInstanceOf(StudioServiceAuthStrategyService);
  });
});
