import { AppEnvsEnum } from '@ikigaians/common';
import { AppConfigService } from 'src/config/app-config.service';
import { LoggerService } from 'src/log/logger.service';
import { FastifyService } from './fastify.service';

describe('FastifyService', () => {
  let logger: LoggerService;
  let appConfigService: AppConfigService;
  let fastifyService: FastifyService;

  beforeEach(() => {
    logger = new LoggerService();
    appConfigService = {
      config: { logger: { level: 'info' }, appEnv: AppEnvsEnum.DEV },
    } as AppConfigService;
    fastifyService = new FastifyService(logger, appConfigService);
  });

  afterAll(async () => {
    await fastifyService.onDispose();
  });

  it('should instantiate FastifyService and create app', () => {
    expect(fastifyService.app).toBeDefined();
  });

  it('should call onInit and register hooks/plugins', async () => {
    const registerSpy = jest.spyOn(fastifyService.app, 'register');
    await fastifyService.onInit();
    expect(registerSpy).toHaveBeenCalled();
  });

  it('should process the lifecycle of router registration', async () => {
    fastifyService.app.get('/some/url', async () => {});

    await fastifyService.onStart();
    await fastifyService.app.inject('/some/url');
  });
});
