// studio-cdn.controller.spec.ts
import { LoggerService } from '@ikigaians/logger';
import { FastifyInstance } from 'fastify';
import { PreHandlersService, RouterService } from 'src/router';
import { StudioCdnController } from 'src/studio/controller/v1/studio-cdn/studio-cdn.controller';
import {
  GetStudioTableCdnRequestType,
  GetStudioTableCdnResponseType,
  InsertStudioTableCdnRequestType,
  InsertStudioTableCdnResponseType,
  UpdateStudioTableCdnRequestType,
  UpdateStudioTableCdnResponseType,
} from 'src/studio/controller/v1/studio-cdn/studio-cdn.type';
import { RoutesEnum } from 'src/studio/enums/studio.router.enum';
import { StudioCdnService } from 'src/studio/services/studio-cdn/studio-cdn.service';

const mockFastify = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  register: jest.fn((callback) => callback(mockFastify)),
} as unknown as FastifyInstance;

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

describe('StudioCdnController', () => {
  let controller: StudioCdnController;

  beforeEach(() => {
    controller = new StudioCdnController(
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
      expect(mockFastify.get).toHaveBeenCalledTimes(1);

      expect(mockFastify.get).toHaveBeenCalledWith(
        RoutesEnum.V1_STUDIO_TABLE_CDN,
        expect.any(Object),
        expect.any(Function),
      );

      expect(mockFastify.post).toHaveBeenCalledWith(
        RoutesEnum.V1_STUDIO_TABLE_CDN,
        expect.any(Object),
        expect.any(Function),
      );
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
      const expectedControllerResponse: GetStudioTableCdnResponseType = {
        tableId: 'UniTest',
        cdnDst: mockServiceResponse.cdnDst,
      };

      (mockStudioCdnService.getTableCdn as jest.Mock).mockResolvedValue(mockServiceResponse);

      const getTableCdnHandler = (mockFastify.get as jest.Mock).mock.calls[0][2];
      const result = await getTableCdnHandler({ query: mockRequestBody });

      expect(mockStudioCdnService.getTableCdn).toHaveBeenCalledWith(mockRequestBody);
      expect(result).toEqual(expectedControllerResponse);
    });

    it('should handle insertTableCdn request and return the correct response', async () => {
      await controller.onInit();
      const mockRequestBody: InsertStudioTableCdnRequestType = {
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
      const expectedControllerResponse: InsertStudioTableCdnResponseType = {
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
      const mockRequestBody: UpdateStudioTableCdnRequestType = {
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
      const expectedControllerResponse: UpdateStudioTableCdnResponseType = {
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
      controller.getTableCdn(mockFastify);
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

  describe('insertTableCdn', () => {
    it('should register the correct route with schema and preHandler', () => {
      controller.insertTableCdn(mockFastify);
      expect(mockFastify.post).toHaveBeenCalledWith(
        RoutesEnum.V1_STUDIO_TABLE_CDN,
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
      controller.updateTableCdn(mockFastify);
      expect(mockFastify.patch).toHaveBeenCalledWith(
        RoutesEnum.V1_STUDIO_TABLE_CDN,
        expect.objectContaining({
          schema: expect.any(Object),
          preHandler: [expect.any(Function)],
        }),
        expect.any(Function),
      );
    });
  });
});
