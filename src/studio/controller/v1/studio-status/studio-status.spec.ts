// studio.controller.spec.ts
import { LoggerService } from '@ikigaians/logger';
import { FastifyInstance } from 'fastify';
import { RoutesEnum } from 'src/global/enums/route.enum';
import { PreHandlersService, RouterService } from 'src/router';
import { StudioStatusController } from 'src/studio/controller/v1/studio-status/studio-status.controller';
import {
  GetTableStatusRequestType,
  GetTableStatusResponseType,
  InsertTableStatusRequestType,
  InsertTableStatusResponseType,
  UpdateTableStatusRequestType,
  UpdateTableStatusResponseType,
} from 'src/studio/controller/v1/studio-status/studio-status.type';
import { StudioDeviceStatusEnum, StudioServiceStatusEnum } from 'src/studio/enums/studio.enums';
import { StudioStatusService } from 'src/studio/services/studio-status/studio-status.service';

const mockFastify = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  register: jest.fn((callback) => callback(mockFastify)),
} as unknown as FastifyInstance;

const mockStudioStatusService = {
  getTableStatus: jest.fn(),
  insertTableStatus: jest.fn(),
  updateTableStatus: jest.fn(),
} as unknown as StudioStatusService;

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

describe('StudioStatusController', () => {
  let controller: StudioStatusController;

  beforeEach(() => {
    controller = new StudioStatusController(
      mockStudioStatusService,
      mockPreHandlersService,
      mockRouterService,
      mockLoggerService,
    );
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should register getTableStatus routes', async () => {
      await controller.onInit();

      expect(mockRouterService.app.register).toHaveBeenCalledTimes(1);

      expect(mockFastify.get).toHaveBeenCalledTimes(1);

      expect(mockFastify.get).toHaveBeenCalledWith(
        RoutesEnum.V1_STUDIO_TABLE_STATUS,
        expect.any(Object),
        expect.any(Function),
      );
    });

    it('should handle the getTableStatus request and return the correct response', async () => {
      await controller.onInit();

      const mockRequestBody: GetTableStatusRequestType = { tableId: 'uniTest' };
      const mockResponse: GetTableStatusResponseType = {
        tableId: 'uniTest',
        uptime: 0,
        timestamp: 0,
        maintenance: false,
        sdp: StudioServiceStatusEnum.STANDBY,
        idp: StudioServiceStatusEnum.STANDBY,
        broker: StudioDeviceStatusEnum.DOWN,
        zCam: StudioDeviceStatusEnum.UP,
        roulette: StudioDeviceStatusEnum.UP,
        shaker: StudioDeviceStatusEnum.DOWN,
        barcodeScanner: StudioDeviceStatusEnum.DOWN,
        nfcScanner: StudioDeviceStatusEnum.DOWN,
      };

      (mockStudioStatusService.getTableStatus as jest.Mock).mockResolvedValue(mockResponse);

      const getTableStatusHandler = (mockFastify.get as jest.Mock).mock.calls[0][2];

      const result = await getTableStatusHandler({ query: mockRequestBody });

      expect(mockStudioStatusService.getTableStatus).toHaveBeenCalledWith(mockRequestBody);
      expect(result).toEqual(mockResponse);
    });

    it('should handle the insertTableStatus request and return the correct response', async () => {
      await controller.onInit();

      const mockRequestBody: InsertTableStatusRequestType = { tableId: 'uniTest' };
      const mockResponse: InsertTableStatusResponseType = {
        tableId: 'uniTest',
        uptime: 0,
        timestamp: 0,
        maintenance: false,
        sdp: StudioServiceStatusEnum.STANDBY,
        idp: StudioServiceStatusEnum.STANDBY,
        broker: StudioDeviceStatusEnum.DOWN,
        zCam: StudioDeviceStatusEnum.UP,
        roulette: StudioDeviceStatusEnum.UP,
        shaker: StudioDeviceStatusEnum.DOWN,
        barcodeScanner: StudioDeviceStatusEnum.DOWN,
        nfcScanner: StudioDeviceStatusEnum.DOWN,
      };

      (mockStudioStatusService.insertTableStatus as jest.Mock).mockResolvedValue(mockResponse);

      const insertTableStatusHandler = (mockFastify.post as jest.Mock).mock.calls[0][2];

      const result = await insertTableStatusHandler({ body: mockRequestBody });

      expect(mockStudioStatusService.insertTableStatus).toHaveBeenCalledWith(mockRequestBody);
      expect(result).toEqual(mockResponse);
    });

    it('should handle the updateTableStatus request and return the correct response', async () => {
      await controller.onInit();

      const mockRequestBody: UpdateTableStatusRequestType = { tableId: 'uniTest' };
      const mockResponse: UpdateTableStatusResponseType = {
        tableId: 'uniTest',
        uptime: 0,
        timestamp: 0,
        maintenance: false,
        sdp: StudioServiceStatusEnum.STANDBY,
        idp: StudioServiceStatusEnum.STANDBY,
        broker: StudioDeviceStatusEnum.DOWN,
        zCam: StudioDeviceStatusEnum.UP,
        roulette: StudioDeviceStatusEnum.UP,
        shaker: StudioDeviceStatusEnum.DOWN,
        barcodeScanner: StudioDeviceStatusEnum.DOWN,
        nfcScanner: StudioDeviceStatusEnum.DOWN,
      };

      (mockStudioStatusService.updateTableStatus as jest.Mock).mockResolvedValue(mockResponse);

      const updateTableStatusHandler = (mockFastify.patch as jest.Mock).mock.calls[0][2];

      const result = await updateTableStatusHandler({ body: mockRequestBody });

      expect(mockStudioStatusService.updateTableStatus).toHaveBeenCalledWith(mockRequestBody);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getTableStatus', () => {
    it('should register the correct route with schema and preHandler', () => {
      controller.getTableStatus(mockFastify);
      expect(mockFastify.get).toHaveBeenCalledWith(
        RoutesEnum.V1_STUDIO_TABLE_STATUS,
        expect.objectContaining({
          schema: expect.any(Object),
          preHandler: [expect.any(Function)],
        }),
        expect.any(Function),
      );
    });
  });

  describe('insertTableStatus', () => {
    it('should register the correct route with schema and preHandler', () => {
      controller.insertTableStatus(mockFastify);
      expect(mockFastify.post).toHaveBeenCalledWith(
        RoutesEnum.V1_STUDIO_TABLE_STATUS,
        expect.objectContaining({
          schema: expect.any(Object),
          preHandler: [expect.any(Function)],
        }),
        expect.any(Function),
      );
    });
  });

  describe('updateTableStatus', () => {
    it('should register the correct route with schema and preHandler', () => {
      controller.updateTableStatus(mockFastify);
      expect(mockFastify.patch).toHaveBeenCalledWith(
        RoutesEnum.V1_STUDIO_TABLE_STATUS,
        expect.objectContaining({
          schema: expect.any(Object),
          preHandler: [expect.any(Function)],
        }),
        expect.any(Function),
      );
    });
  });
});
