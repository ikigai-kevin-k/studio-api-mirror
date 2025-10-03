/* eslint-disable unicorn/no-unreadable-array-destructuring */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from '@ikigaians/logger';
import { RoutesEnum } from 'src/global/enums/route.enum';
import { PreHandlersService, RouterService } from 'src/router';
import { StudioCdnService } from 'src/studio/services/studio-cdn/studio-cdn.service';
import { StudioDeviceDataService } from 'src/studio/services/studio-device/studio-device-data.service';
import { StudioService } from 'src/studio/services/studio/studio.service';
import { TableApiSignalService } from 'src/table-api/services/table-api-signal/table-api-signal.service';
import { QaSignalSimulatorController } from './qa-signal-simulator.controller';
import { ErrorSignalRequestType } from './qa-signal-simulator.controller.type';

const mockStudioCdnService = {
  getTableCdn: jest.fn(),
};

const mockStudioDeviceDataService = {
  getDeviceBelongTo: jest.fn(),
};

const mockStudioService = {
  getStudioTableBelongTo: jest.fn(),
};

const mockTableApiSignalService = {
  forwardSignal: jest.fn(),
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

describe('QaSignalSimulatorController', () => {
  let controller: QaSignalSimulatorController;

  beforeAll(() => {
    controller = new QaSignalSimulatorController(
      mockStudioService as unknown as StudioService,
      mockStudioDeviceDataService as unknown as StudioDeviceDataService,
      mockStudioCdnService as unknown as StudioCdnService,
      mockTableApiSignalService as unknown as TableApiSignalService,
      mockPreHandlersService as unknown as PreHandlersService,
      mockRouterService as unknown as RouterService,
      mockLoggerService as unknown as LoggerService,
    );
  });

  beforeEach(() => {
    controller = new QaSignalSimulatorController(
      mockStudioService as unknown as StudioService,
      mockStudioDeviceDataService as unknown as StudioDeviceDataService,
      mockStudioCdnService as unknown as StudioCdnService,
      mockTableApiSignalService as unknown as TableApiSignalService,
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
      expect(mockRouterService.app.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('postTableApiErrorSignal', () => {
    it('should register a POST route with the correct schema and handler', async () => {
      await controller.onInit();
      const [route, options, handler] = mockRouterService.app.post.mock.calls[0];

      expect(route).toBe(RoutesEnum.V1_QA_SIMULATE_TABLE_API_ERROR_SIGNAL);
      expect(options.schema).toBeDefined();
      expect(options.preHandler).toBeDefined();
      expect(handler).toBeInstanceOf(Function);
    });

    it('should call tableApiSignalService.forwardSignal and return the correct response', async () => {
      const request: ErrorSignalRequestType = {
        Params: { gameCode: 'test-001' },
        Body: {
          msgId: '',
          metadata: {
            gameCode: '',
            tablename: '',
            title: '',
            description: '',
            code: '',
            suggestion: '',
          },
        },
      };

      const result = {
        data: {
          table: {
            gameCode: '',
            gameType: '',
            visibility: '',
            betPeriod: 0,
            name: '',
            pause: {
              reason: '',
              createdBy: '',
              createdAt: new Date(),
              createTime: 0,
            },
            maintenance: {
              status: '',
              createTime: 0,
              endTime: 0,
              startTime: 0,
              createdBy: '',
            },
            streams: {
              primary: {
                lo: '',
                me: '',
                hi: '',
                hd: '',
              },
              secondary: {
                lo: '',
                me: '',
                hi: '',
                hd: '',
              },
            },
            autopilot: {
              enable: false,
              resultSequence: [],
              lastResultIndex: 0,
            },
            sdpConfig: {},
            tableRound: {
              roundId: '',
              gameCode: '',
              gameType: '',
              betStopTime: new Date(),
              status: '',
              result: {},
              createdAt: new Date(),
            },
            metadata: {},
            autoBetStop: false,
          },
        },
      };

      mockTableApiSignalService.forwardSignal.mockResolvedValue(result);

      await controller.onInit();
      const [, , handler] = mockRouterService.app.post.mock.calls[0];

      const response = await handler({ params: request.Params, body: request.Body } as any);

      expect(mockTableApiSignalService.forwardSignal).toHaveBeenCalledTimes(1);
      expect(response).toEqual({ table: result.data.table });
    });
  });
});
