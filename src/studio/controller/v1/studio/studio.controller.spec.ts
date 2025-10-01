// studio.controller.spec.ts
import { LoggerService } from '@ikigaians/logger';
import { FastifyInstance } from 'fastify';
import { RoutesEnum } from 'src/global/enums/route.enum';
import { PreHandlersService, RouterService } from 'src/router';
import { StudioController } from 'src/studio/controller/v1/studio/studio.controller';
import {
  GetStudioTableRequestType,
  GetStudioTableResponseType,
  InsertStudioTableRequestType,
  InsertStudioTableResponseType,
  UpdateStudioTableStatusRequestType,
  UpdateStudioTableStatusResponseType,
} from 'src/studio/controller/v1/studio/studio.type';
import { StudioTableStatusEnum } from 'src/studio/enums/studio.enums';
import { StudioService } from 'src/studio/services/studio/studio.service';

const mockFastify = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  register: jest.fn((callback) => callback(mockFastify)),
} as unknown as FastifyInstance;

const mockStudioService = {
  getStudioTable: jest.fn(),
  insertStudioTable: jest.fn(),
  updateStudioTable: jest.fn(),
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
    it('should register getStudioTable with app.get and insertStudioTable with app.post', async () => {
      await controller.onInit();
      expect(mockRouterService.app.register).toHaveBeenCalledTimes(1);
      expect(mockFastify.get).toHaveBeenCalledTimes(1);
      expect(mockFastify.post).toHaveBeenCalledTimes(1);
      expect(mockFastify.get).toHaveBeenCalledWith(
        RoutesEnum.V1_STUDIO_TABLE,
        expect.any(Object),
        expect.any(Function),
      );
      expect(mockFastify.post).toHaveBeenCalledWith(
        RoutesEnum.V1_STUDIO_TABLE,
        expect.any(Object),
        expect.any(Function),
      );
    });

    it('should handle getStudioTable request from query and return the correct response', async () => {
      await controller.onInit();
      const mockRequestQuery: GetStudioTableRequestType = { tableId: ['uniTest'] };
      const mockServiceResponse: GetStudioTableResponseType = {
        list: [{ tableId: 'uniTest-1', tableStatus: 'active', gameId: 'game1' }],
      };

      (mockStudioService.getStudioTable as jest.Mock).mockResolvedValue(mockServiceResponse);
      const getStudioTableHandler = (mockFastify.get as jest.Mock).mock.calls[0][2];
      const result = await getStudioTableHandler({ query: mockRequestQuery });

      expect(mockStudioService.getStudioTable).toHaveBeenCalledWith(mockRequestQuery);
      expect(result).toEqual(mockServiceResponse);
    });

    it('should handle insertStudioTable request from body and return the correct response', async () => {
      await controller.onInit();
      const mockRequestBody: InsertStudioTableRequestType = {
        tableId: 'uniTest',
      };
      const mockServiceResponse: InsertStudioTableResponseType = {
        tableId: 'uniTest',
        tableStatus: 'inactive',
        gameId: '',
      };

      (mockStudioService.insertStudioTable as jest.Mock).mockResolvedValue(mockServiceResponse);
      const insertStudioTableHandler = (mockFastify.post as jest.Mock).mock.calls[0][2];
      const result = await insertStudioTableHandler({ body: mockRequestBody });

      expect(mockStudioService.insertStudioTable).toHaveBeenCalledWith(mockRequestBody);
      expect(result).toEqual(mockServiceResponse);
    });

    it('should handle updateStudioTable request from body and return the correct response', async () => {
      await controller.onInit();
      const mockRequestBody: UpdateStudioTableStatusRequestType = {
        tableId: 'uniTest',
        tableStatus: StudioTableStatusEnum.INACTIVE,
      };
      const mockServiceResponse: UpdateStudioTableStatusResponseType = {
        tableId: 'uniTest',
        tableStatus: 'inactive',
      };

      (mockStudioService.updateStudioTable as jest.Mock).mockResolvedValue(mockServiceResponse);
      const updateStudioTableHandler = (mockFastify.patch as jest.Mock).mock.calls[0][2];
      const result = await updateStudioTableHandler({ body: mockRequestBody });

      expect(mockStudioService.updateStudioTable).toHaveBeenCalledWith(mockRequestBody);
      expect(result).toEqual(mockServiceResponse);
    });
  });

  describe('getStudioTable', () => {
    it('should register the correct GET route with schema and preHandler', () => {
      controller.getStudioTable(mockFastify);
      expect(mockFastify.get).toHaveBeenCalledWith(
        RoutesEnum.V1_STUDIO_TABLE,
        expect.objectContaining({
          schema: expect.any(Object),
          preHandler: [expect.any(Function)],
        }),
        expect.any(Function),
      );
    });
  });

  describe('insertStudioTable', () => {
    it('should register the correct POST route with schema and preHandler', () => {
      controller.insertStudioTable(mockFastify);
      expect(mockFastify.post).toHaveBeenCalledWith(
        RoutesEnum.V1_STUDIO_TABLE,
        expect.objectContaining({
          schema: expect.any(Object),
          preHandler: [expect.any(Function)],
        }),
        expect.any(Function),
      );
    });
  });

  describe('updateStudioTable', () => {
    it('should register the correct PATCH route with schema and preHandler', () => {
      controller.updateStudioTableStatus(mockFastify);
      expect(mockFastify.patch).toHaveBeenCalledWith(
        RoutesEnum.V1_STUDIO_TABLE,
        expect.objectContaining({
          schema: expect.any(Object),
          preHandler: [expect.any(Function)],
        }),
        expect.any(Function),
      );
    });
  });
});
