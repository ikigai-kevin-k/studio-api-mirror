import { ServiceAuthStrategyService } from '@ikigaians/auth';
import { AppConfigService } from 'src/config';

export class StudioServiceAuthStrategyService extends ServiceAuthStrategyService {
  constructor(private readonly appConfigService: AppConfigService) {
    const { serviceApiSignature } = appConfigService.authConfig;
    super(serviceApiSignature);
  }
}
