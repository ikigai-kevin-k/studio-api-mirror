import { AppEnvsEnum } from '@ikigaians/common';
import { AppConfigService } from 'src/config/app-config.service';
import { LoggerService } from 'src/log/logger.service';
import { RouterService } from './router.service';

describe('RouterService', () => {
  let logger: LoggerService;
  let appConfigService: AppConfigService;
  let routerService: RouterService;

  beforeEach(() => {
    logger = new LoggerService();
    appConfigService = {
      config: { logger: { level: 'info' }, appEnv: AppEnvsEnum.DEV },
    } as AppConfigService;
    routerService = new RouterService(logger, appConfigService);
  });

  afterAll(async () => {
    await routerService.onDispose();
  });

  it('should instantiate routerService and create app', () => {
    expect(routerService.app).toBeDefined();
  });

  it('should call onInit and register hooks/plugins', async () => {
    const registerSpy = jest.spyOn(routerService.app, 'register');
    await routerService.onInit();
    expect(registerSpy).toHaveBeenCalled();
  });

  it('should process the lifecycle of router registration', async () => {
    routerService.app.get('/some/url', async () => {});

    await routerService.onStart();
    await routerService.app.inject('/some/url');
  });
});
