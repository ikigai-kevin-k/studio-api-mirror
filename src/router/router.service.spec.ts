import { HealthcheckController } from 'src/healthcheck/healthcheck.controller';
import { FastifyService } from './fastify.service';
import { RouterService } from './router.service';

describe('RouterService', () => {
  let fastifyService: FastifyService;
  let healthcheckController: HealthcheckController;
  let routerService: RouterService;

  beforeEach(() => {
    fastifyService = {
      app: {
        addHook: jest.fn(),
      },
    } as unknown as FastifyService;
    healthcheckController = {
      registerRoutes: jest.fn(),
    } as unknown as HealthcheckController;
    routerService = new RouterService(fastifyService, healthcheckController);
  });

  it('should instantiate and add healthcheckController', () => {
    expect(routerService).toBeDefined();
  });

  it('should call addHook and registerRoutes on onInit', async () => {
    await routerService.onInit();
    expect(fastifyService.app.addHook).toHaveBeenCalledWith('onRoute', expect.any(Function));
    expect(healthcheckController.registerRoutes).toHaveBeenCalledWith(fastifyService.app);
  });
});
