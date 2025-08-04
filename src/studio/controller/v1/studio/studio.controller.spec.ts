// studio.controller.spec.ts
import { LoggerService } from '@ikigaians/logger';
import { FastifyInstance } from 'fastify';
import { PreHandlersService, RouterService } from 'src/router';
import { StudioController } from 'src/studio/controller/v1/studio/studio.controller';
import {
  GetStudioTableRequestType,
  GetStudioTableResponseType,
  UpsertStudioTableRequestType,
  UpsertStudioTableResponseType,
} from 'src/studio/controller/v1/studio/studio.type';
import { StudioTableStatusType } from 'src/studio/enums/studio.enums';
import { RoutesEnum } from 'src/studio/enums/studio.router.enum';
import { StudioService } from 'src/studio/services/studio/studio.service';

const mockFastify = {
  post: jest.fn(),
  register: jest.fn((callback) => callback(mockFastify)),
} as unknown as FastifyInstance;

const mockStudioService = {
  getStudioTable: jest.fn(),
  upsertStudioTable: jest.fn(),
} as unknown as StudioService;

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

describe('StudioController', () => {
  let controller: StudioController;

  beforeEach(() => {
    controller = new StudioController(
      mockStudioService,
      mockPreHandlersService,
      mockRouterService,
      mockLoggerService,
    );
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should register both getStudioTable and upsertStudioTable routes', async () => {
      await controller.onInit();

      expect(mockRouterService.app.register).toHaveBeenCalledTimes(1);

      expect(mockFastify.post).toHaveBeenCalledTimes(2);

      expect(mockFastify.post).toHaveBeenCalledWith(
        RoutesEnum.V1_GET_STUDIO_TABLE,
        expect.any(Object),
        expect.any(Function),
      );

      expect(mockFastify.post).toHaveBeenCalledWith(
        RoutesEnum.V1_UPSERT_STUDIO_TABLE,
        expect.any(Object),
        expect.any(Function),
      );
    });

    it('should handle the getStudioTable request and return the correct response', async () => {
      await controller.onInit();

      const mockRequestBody: GetStudioTableRequestType = { tableId: ['uniTest'] };
      const mockResponse: GetStudioTableResponseType = {
        list: [{ tableId: 'uniTest', tableStatus: 'inactive' }],
      };

      (mockStudioService.getStudioTable as jest.Mock).mockResolvedValue(mockResponse);

      const getStudioTableHandler = (mockFastify.post as jest.Mock).mock.calls[0][2];

      const result = await getStudioTableHandler({ body: mockRequestBody });

      expect(mockStudioService.getStudioTable).toHaveBeenCalledWith(mockRequestBody);
      expect(result).toEqual(mockResponse);
    });

    it('should handle the upsertStudioTable request and return the correct response', async () => {
      await controller.onInit();

      const mockRequestBody: UpsertStudioTableRequestType = {
        tableId: 'uniTest',
        tableStatus: StudioTableStatusType.INACTIVE,
      };
      const mockResponse: UpsertStudioTableResponseType = {
        tableId: 'uniTest',
        tableStatus: 'inactive',
      };

      (mockStudioService.upsertStudioTable as jest.Mock).mockResolvedValue(mockResponse);

      const upsertStudioTableHandler = (mockFastify.post as jest.Mock).mock.calls[1][2];

      const result = await upsertStudioTableHandler({ body: mockRequestBody });

      expect(mockStudioService.upsertStudioTable).toHaveBeenCalledWith(mockRequestBody);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getStudioTable', () => {
    it('should register the correct route with schema and preHandler', () => {
      controller.getStudioTable(mockFastify);
      expect(mockFastify.post).toHaveBeenCalledWith(
        RoutesEnum.V1_GET_STUDIO_TABLE,
        expect.objectContaining({
          schema: expect.any(Object),
          preHandler: [expect.any(Function)],
        }),
        expect.any(Function),
      );
    });
  });

  describe('upsertStudioTable', () => {
    it('should register the correct route with schema and preHandler', () => {
      controller.upsertStudioTable(mockFastify);
      expect(mockFastify.post).toHaveBeenCalledWith(
        RoutesEnum.V1_UPSERT_STUDIO_TABLE,
        expect.objectContaining({
          schema: expect.any(Object),
          preHandler: [expect.any(Function)],
        }),
        expect.any(Function),
      );
    });
  });
});
