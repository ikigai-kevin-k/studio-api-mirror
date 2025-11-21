// studio-cdn.controller.spec.ts
import { LoggerService } from '@ikigaians/logger';
import { FastifyInstance } from 'fastify';
import { RoutesEnum } from 'src/global/enums/route.enum';
import { PreHandlersService, RouterService } from 'src/router';
import { StudioCdnService } from 'src/studio/services/studio-cdn/studio-cdn.service';
import { StudioGameService } from 'src/studio/services/studio-game/studio-game.service';
import { StudioCdnController_V2 } from './studio-cdn.controller';
import {
  GetStudioTableCdnRequestType,
  GetStudioTableCdnResponseType,
} from './studio-cdn.controller.type';

const mockFastify = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  register: jest.fn((callback) => callback(mockFastify)),
} as unknown as FastifyInstance;

const mockStudioGameService = {
  getGame: jest.fn(),
} as unknown as StudioGameService;

const mockStudioCdnService = {
  getTableCdn: jest.fn(),
  insertTableCdn: jest.fn(),
  updateTableCdn: jest.fn(),
} as unknown as StudioCdnService;

const mockPreHandlersService = {
  serviceApisAuthenticator: jest.fn(),
} as unknown as PreHandlersService;

const mockRouterService = {
  app: mockFastify,
} as unknown as RouterService;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

describe('StudioCdnController_V2', () => {
  let controller: StudioCdnController_V2;

  beforeEach(() => {
    controller = new StudioCdnController_V2(
      mockStudioGameService,
      mockStudioCdnService,
      mockPreHandlersService,
      mockRouterService,
      mockLoggerService,
    );
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should register both getTableCdn and insertTableCdn routes', async () => {
      await controller.onInit();

      expect(mockRouterService.app.register).toHaveBeenCalledTimes(1);
      expect(mockFastify.get).toHaveBeenCalledTimes(1);
    });

    it('should handle getTableCdn request and format response correctly', async () => {
      await controller.onInit();
      const mockRequestBody: GetStudioTableCdnRequestType = { physicalTableCode: 'UniTest' };
      const mockServiceResponse = {
        tableId: 'UniTest',
        cdnDst: {
          primary: {
            lo: 'http://ikg-cit.io/hd.flv',
            me: 'http://ikg-cit.io/hd.flv',
            hi: 'http://ikg-cit.io/hd.flv',
            hd: 'http://ikg-cit.io/hd.flv',
          },
          secondary: {
            lo: 'http://ikg-cit.io/hd.flv',
            me: 'http://ikg-cit.io/hd.flv',
            hi: 'http://ikg-cit.io/hd.flv',
            hd: 'http://ikg-cit.io/hd.flv',
          },
        },
      };
      const mockStudioGameServiceResult = {
        currentTableId: 'UniTest',
      };
      const expectedControllerResponse: GetStudioTableCdnResponseType = {
        physicalTableCode: 'UniTest',
        cdnDst: mockServiceResponse.cdnDst,
      };

      (mockStudioGameService.getGame as jest.Mock).mockResolvedValueOnce(
        mockStudioGameServiceResult,
      );
      (mockStudioCdnService.getTableCdn as jest.Mock).mockResolvedValue(mockServiceResponse);

      const getTableCdnHandler = (mockFastify.get as jest.Mock).mock.calls[0][2];
      const result = await getTableCdnHandler({ query: mockRequestBody });

      expect(mockStudioCdnService.getTableCdn).toHaveBeenCalledWith({
        tableId: mockStudioGameServiceResult.currentTableId,
      });
      expect(result).toEqual(expectedControllerResponse);
    });
  });

  describe('getTableCdn', () => {
    it('should register the correct route with schema and preHandler', () => {
      controller.getGameCdn(mockFastify);
      expect(mockFastify.get).toHaveBeenCalledWith(
        RoutesEnum.V2_STUDIO_TABLE_CDN,
        expect.objectContaining({
          schema: expect.any(Object),
          preHandler: [expect.any(Function)],
        }),
        expect.any(Function),
      );
    });
  });
});
