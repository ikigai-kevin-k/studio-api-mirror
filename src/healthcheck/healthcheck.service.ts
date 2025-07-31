import { AppConfigService } from 'src/config';
import { HealthcheckType } from 'src/healthcheck/healthcheck.dto';

export class HealthcheckService {
  constructor(private readonly appConfigService: AppConfigService) {}

  async getStatus(): Promise<HealthcheckType> {
    const { appName, appEnv } = this.appConfigService.config;

    return {
      service: appName,
      environment: appEnv,
      uptime: process.uptime(),
      timestamp: Date.now(),
      maintenance: false,
      version: appEnv,
    };
  }
}
