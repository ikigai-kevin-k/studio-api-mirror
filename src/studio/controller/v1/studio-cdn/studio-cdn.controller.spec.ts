// studio-cdn.controller.spec.ts
import { LoggerService } from '@ikigaians/logger';
import { FastifyInstance } from 'fastify';
import { RoutesEnum } from 'src/global/enums/route.enum';
import { PreHandlersService, RouterService } from 'src/router';
import { StudioCdnController } from 'src/studio/controller/v1/studio-cdn/studio-cdn.controller';
import {
  GetStudioTableCdnRequestType,
  GetStudioTableCdnResponseType,
  InsertStudioTableStreamRequestType,
  InsertStudioTableStreamResponseType,
  UpdateStudioTableStreamRequestType,
  UpdateStudioTableStreamResponseType,
} from 'src/studio/controller/v1/studio-cdn/studio-cdn.type';
import { StudioCdnService } from 'src/studio/services/studio-cdn/studio-cdn.service';
import { StudioGameService } from 'src/studio/services/studio-game/studio-game.service';
import { TableApiForwardService } from 'src/table-api/services/table-api-forward/table-api-forward.service';

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

const mockTableApiForwardService = {
  forwardCDN: jest.fn(),
} as unknown as TableApiForwardService;

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

describe('StudioCdnController', () => {
  let controller: StudioCdnController;

  beforeEach(() => {
    controller = new StudioCdnController(
      mockStudioGameService,
      mockStudioCdnService,
      mockTableApiForwardService,
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
      expect(mockFastify.get).toHaveBeenCalledTimes(2);
      expect(mockFastify.post).toHaveBeenCalledTimes(1);
      expect(mockFastify.patch).toHaveBeenCalledTimes(1);
    });

    it('should handle getTableCdn request and format response correctly', async () => {
      await controller.onInit();
      const mockRequestBody: GetStudioTableCdnRequestType = { tableId: 'UniTest' };
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
        tableId: 'UniTest',
        cdnDst: mockServiceResponse.cdnDst,
      };

      (mockStudioGameService.getGame as jest.Mock).mockResolvedValueOnce(
        mockStudioGameServiceResult,
      );
      (mockStudioCdnService.getTableCdn as jest.Mock).mockResolvedValue(mockServiceResponse);

      const getTableCdnHandler = (mockFastify.get as jest.Mock).mock.calls[0][2];
      const result = await getTableCdnHandler({ query: mockRequestBody });

      expect(mockStudioCdnService.getTableCdn).toHaveBeenCalledWith(mockRequestBody);
      expect(result).toEqual(expectedControllerResponse);
    });

    it('should handle insertTableCdn request and return the correct response', async () => {
      await controller.onInit();
      const mockRequestBody: InsertStudioTableStreamRequestType = {
        tableId: 'uniTest',
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
      const expectedControllerResponse: InsertStudioTableStreamResponseType = {
        tableId: 'uniTest',
        cdnDst: mockRequestBody.cdnDst,
      };

      (mockStudioCdnService.insertTableCdn as jest.Mock).mockResolvedValue(
        expectedControllerResponse,
      );

      const insertTableCdnHandler = (mockFastify.post as jest.Mock).mock.calls[0][2];
      const result = await insertTableCdnHandler({ body: mockRequestBody });

      expect(mockStudioCdnService.insertTableCdn).toHaveBeenCalledWith(mockRequestBody);
      expect(result).toEqual(expectedControllerResponse);
    });

    it('should handle updateTableCdn request and return the correct response', async () => {
      await controller.onInit();
      const mockRequestBody: UpdateStudioTableStreamRequestType = {
        tableId: 'uniTest',
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
      const expectedControllerResponse: UpdateStudioTableStreamResponseType = {
        tableId: 'uniTest',
        cdnDst: mockRequestBody.cdnDst,
      };

      (mockStudioCdnService.updateTableCdn as jest.Mock).mockResolvedValue(
        expectedControllerResponse,
      );

      const updateTableCdnHandler = (mockFastify.patch as jest.Mock).mock.calls[0][2];
      const result = await updateTableCdnHandler({ body: mockRequestBody });

      expect(mockStudioCdnService.updateTableCdn).toHaveBeenCalledWith(mockRequestBody);
      expect(result).toEqual(expectedControllerResponse);
    });
  });

  describe('getTableCdn', () => {
    it('should register the correct route with schema and preHandler', () => {
      controller.getGameCdn(mockFastify);
      expect(mockFastify.get).toHaveBeenCalledWith(
        RoutesEnum.V1_STUDIO_TABLE_CDN,
        expect.objectContaining({
          schema: expect.any(Object),
          preHandler: [expect.any(Function)],
        }),
        expect.any(Function),
      );
    });
  });

  describe('getTableStream', () => {
    it('should register the correct route with schema and preHandler', () => {
      controller.getTableStream(mockFastify);
      expect(mockFastify.get).toHaveBeenCalledWith(
        RoutesEnum.V1_STUDIO_TABLE_STREAM,
        expect.objectContaining({
          schema: expect.any(Object),
          preHandler: [expect.any(Function)],
        }),
        expect.any(Function),
      );
    });
  });

  describe('insertTableStream', () => {
    it('should register the correct route with schema and preHandler', () => {
      controller.insertTableStream(mockFastify);
      expect(mockFastify.post).toHaveBeenCalledWith(
        RoutesEnum.V1_STUDIO_TABLE_STREAM,
        expect.objectContaining({
          schema: expect.any(Object),
          preHandler: [expect.any(Function)],
        }),
        expect.any(Function),
      );
    });
  });

  describe('updateTableCdn', () => {
    it('should register the correct route with schema and preHandler', () => {
      controller.updateTableStream(mockFastify);
      expect(mockFastify.patch).toHaveBeenCalledWith(
        RoutesEnum.V1_STUDIO_TABLE_STREAM,
        expect.objectContaining({
          schema: expect.any(Object),
          preHandler: [expect.any(Function)],
        }),
        expect.any(Function),
      );
    });
  });
});
