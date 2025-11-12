/* eslint-disable unicorn/no-unreadable-array-destructuring */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from '@ikigaians/logger';
import { RoutesEnum } from 'src/global/enums/route.enum';
import { PreHandlersService, RouterService } from 'src/router';
import { StudioErrorSignalLogService } from 'src/studio/services/studio-log/studio-error-signal-log.service';
import { StudioErrorSignalLogController } from './studio-error-signal-log.controller';
import { GetStudioErrorSignalRequestType } from './studio-error-signal-log.controller.type';

const mockStudioErrorSignalService = {
  getLogsFromId: jest.fn(),
};

const mockPreHandlersService = {
  serviceApisAuthenticator: jest.fn(),
};

const mockRouterService = {
  app: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    register: jest.fn(),
  },
};

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
};

mockRouterService.app.register.mockImplementation(async (callback) => {
  await callback(mockRouterService.app);
});

describe('StudioErrorSignalLogController', () => {
  let controller: StudioErrorSignalLogController;

  beforeAll(() => {
    controller = new StudioErrorSignalLogController(
      mockStudioErrorSignalService as unknown as StudioErrorSignalLogService,
      mockPreHandlersService as unknown as PreHandlersService,
      mockRouterService as unknown as RouterService,
      mockLoggerService as unknown as LoggerService,
    );
  });

  beforeEach(() => {
    controller = new StudioErrorSignalLogController(
      mockStudioErrorSignalService as unknown as StudioErrorSignalLogService,
      mockPreHandlersService as unknown as PreHandlersService,
      mockRouterService as unknown as RouterService,
      mockLoggerService as unknown as LoggerService,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('onInit', () => {
    it('should register all routes on initialization', async () => {
      await controller.onInit();
      expect(mockRouterService.app.register).toHaveBeenCalledTimes(1);
      expect(mockRouterService.app.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('getStudioErrorSignalLog', () => {
    it('should register a POST route with the correct schema and handler', async () => {
      await controller.onInit();
      const [route, options, handler] = mockRouterService.app.get.mock.calls[0];

      expect(route).toBe(RoutesEnum.V1_STUDIO_ERROR_SIGNAL_LOG);
      expect(options.schema).toBeDefined();
      expect(options.preHandler).toBeDefined();
      expect(handler).toBeInstanceOf(Function);
    });

    it('should call tableApiSignalService.forwardSignal and return the correct response', async () => {
      const mockRequestQuery: GetStudioErrorSignalRequestType = { signalId: 1, limit: 1 };
      const currentTime = new Date();
      const mockServiceResponse = [
        {
          id: 1,
          deviceId: 'idp',
          errorSignal: {},
          resolved: false,
          createdAt: currentTime,
          updatedAt: currentTime,
        },
      ];

      const result = [
        {
          id: 1,
          deviceId: 'idp',
          errorSignal: {},
          resolved: false,
          createdAt: currentTime.toISOString(),
          updatedAt: currentTime.toISOString(),
        },
      ];

      mockStudioErrorSignalService.getLogsFromId.mockResolvedValue(mockServiceResponse);

      await controller.onInit();
      const [, , handler] = mockRouterService.app.get.mock.calls[0];

      const response = await handler({ query: mockRequestQuery } as any);

      expect(mockStudioErrorSignalService.getLogsFromId).toHaveBeenCalledTimes(1);
      expect(response).toEqual(result);
    });
  });
});
