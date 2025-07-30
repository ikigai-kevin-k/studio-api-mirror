import { FastifyInstance } from 'fastify';
import { PreHandlersService } from '../router/pre-handlers/pre-handlers.service';
import { RoutesEnum } from '../router/routes.enum';
import { HealthcheckController } from './healthcheck.controller';
import { HealthcheckService } from './healthcheck.service';

describe('HealthcheckController', () => {
  let controller: HealthcheckController;
  let preHandlersService: jest.Mocked<PreHandlersService>;
  let healthcheckService: jest.Mocked<HealthcheckService>;
  let fastify: { register: jest.Mock; get: jest.Mock };

  beforeEach(() => {
    preHandlersService = {
      serviceApisAuthenticator: jest.fn(),
    } as unknown as jest.Mocked<PreHandlersService>;
    healthcheckService = {
      getStatus: jest.fn().mockResolvedValue({ status: 'ok' }),
    } as unknown as jest.Mocked<HealthcheckService>;
    fastify = {
      register: jest.fn((fn) => fn(fastify)),
      get: jest.fn(),
    };
    controller = new HealthcheckController(preHandlersService, healthcheckService);
  });

  it('should instantiate', () => {
    expect(controller).toBeInstanceOf(HealthcheckController);
  });

  it('should register routes', async () => {
    await controller.registerRoutes(fastify as unknown as FastifyInstance);
    expect(fastify.register).toHaveBeenCalled();
    expect(fastify.get).toHaveBeenCalledWith(
      RoutesEnum.V1_HEALTHCHECK,
      expect.objectContaining({
        schema: expect.any(Object),
        preHandler: [expect.any(Function)],
      }),
      expect.any(Function),
    );
  });

  it('should set up getStatus route with correct preHandler and schema', () => {
    controller.getStatus(fastify as unknown as FastifyInstance);
    expect(fastify.get).toHaveBeenCalledWith(
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
    fastify.get.mockImplementation((route, opts, fn) => {
      handler = fn;
    });
    controller.getStatus(fastify as unknown as FastifyInstance);
    await handler!();
    expect(healthcheckService.getStatus).toHaveBeenCalled();
  });
});
