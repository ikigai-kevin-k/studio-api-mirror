import { RouterService } from 'src/router';
import { PreHandlersService } from '../router/pre-handlers/pre-handlers.service';
import { HealthcheckController } from './healthcheck.controller';
import { RoutesEnum } from './healthcheck.enum';
import { HealthcheckService } from './healthcheck.service';

describe('HealthcheckController', () => {
  let controller: HealthcheckController;
  let preHandlersService: jest.Mocked<PreHandlersService>;
  let healthcheckService: jest.Mocked<HealthcheckService>;
  let routerService: jest.Mocked<RouterService>;

  beforeEach(() => {
    preHandlersService = {
      serviceApisAuthenticator: jest.fn(),
    } as unknown as jest.Mocked<PreHandlersService>;
    healthcheckService = {
      getStatus: jest.fn().mockResolvedValue({ status: 'ok' }),
    } as unknown as jest.Mocked<HealthcheckService>;

    routerService = {
      app: {
        register: jest.fn(),
        get: jest.fn(),
      },
    } as unknown as jest.Mocked<RouterService>;
    controller = new HealthcheckController(preHandlersService, healthcheckService, routerService);
  });

  it('should instantiate', () => {
    expect(controller).toBeInstanceOf(HealthcheckController);
  });

  it('should register routes', async () => {
    await controller.onInit();
    expect(routerService.app.register).toHaveBeenCalled();
  });

  it('should set up getStatus route with correct preHandler and schema', () => {
    controller.getStatus(routerService.app);
    expect(routerService.app.get).toHaveBeenCalledWith(
      RoutesEnum.V1_HEALTHCHECK,
      expect.objectContaining({
        schema: expect.any(Object),
        preHandler: [expect.any(Function)],
      }),
      expect.any(Function),
    );
  });

  it('should call healthcheckService.getStatus in route handler', async () => {
    let handler: (() => Promise<import('./healthcheck.dto').HealthcheckType>) | undefined;
    (<jest.Mock>routerService.app.get).mockImplementation((route, opts, fn) => {
      handler = fn;
    });
    controller.getStatus(routerService.app);
    await handler!();
    expect(healthcheckService.getStatus).toHaveBeenCalled();
  });
});
