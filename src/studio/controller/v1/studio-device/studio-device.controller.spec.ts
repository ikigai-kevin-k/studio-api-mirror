/* eslint-disable unicorn/no-unreadable-array-destructuring */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from '@ikigaians/logger';
import { RoutesEnum } from 'src/global/enums/route.enum';
import { PreHandlersService, RouterService } from 'src/router';
import { StudioDeviceDataService } from 'src/studio/services/studio-device/studio-device-data.service';
import { StudioDeviceDataController } from './studio-device.controller';

const mockStudioDeviceDataService = {
  getDevice: jest.fn(),
  insertDevice: jest.fn(),
  updateDevice: jest.fn(),
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

describe('StudioDeviceDataController', () => {
  let controller: StudioDeviceDataController;

  beforeAll(() => {
    controller = new StudioDeviceDataController(
      mockStudioDeviceDataService as unknown as StudioDeviceDataService,
      mockPreHandlersService as unknown as PreHandlersService,
      mockRouterService as unknown as RouterService,
      mockLoggerService as unknown as LoggerService,
    );
  });

  beforeEach(() => {
    controller = new StudioDeviceDataController(
      mockStudioDeviceDataService as unknown as StudioDeviceDataService,
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
      expect(mockRouterService.app.post).toHaveBeenCalledTimes(1);
      expect(mockRouterService.app.patch).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDevice', () => {
    it('should register a GET route with the correct schema and handler', async () => {
      await controller.onInit();
      const [route, options, handler] = mockRouterService.app.get.mock.calls[0];

      expect(route).toBe(RoutesEnum.V1_STUDIO_DEVICE);
      expect(options.schema).toBeDefined();
      expect(options.preHandler).toBeDefined();
      expect(handler).toBeInstanceOf(Function);
    });

    it('should call studioDeviceDataService.getDevice and return the correct response', async () => {
      const tableId = 'test-table-id';
      const deviceId = 'test-device-id';
      const mockResult = {
        tableId: tableId,
        deviceId: deviceId,
      };

      mockStudioDeviceDataService.getDevice.mockResolvedValue(mockResult);

      await controller.onInit();
      const [, , handler] = mockRouterService.app.get.mock.calls[0];

      const req = { query: { deviceId: deviceId } };
      const response = await handler(req as any);

      expect(mockStudioDeviceDataService.getDevice).toHaveBeenCalledWith({ deviceId: deviceId });
      expect(response).toEqual({
        tableId: tableId,
        deviceId: deviceId,
      });
    });
  });

  describe('insertTableStream', () => {
    it('should register a POST route with the correct schema and handler', async () => {
      await controller.onInit();
      const [route, options, handler] = mockRouterService.app.post.mock.calls[0];

      expect(route).toBe(RoutesEnum.V1_STUDIO_DEVICE);
      expect(options.schema).toBeDefined();
      expect(options.preHandler).toBeDefined();
      expect(handler).toBeInstanceOf(Function);
    });

    it('should call studioDeviceDataService.insertDevice and return the correct response', async () => {
      const deviceId = 'test-device-id';
      const mockResult = {
        deviceId: deviceId,
      };

      mockStudioDeviceDataService.insertDevice.mockResolvedValue(mockResult);

      await controller.onInit();
      const [, , handler] = mockRouterService.app.post.mock.calls[0];

      const req = { body: { deviceId: deviceId } };
      const response = await handler(req as any);

      expect(mockStudioDeviceDataService.insertDevice).toHaveBeenCalledWith({ deviceId: deviceId });
      expect(response).toEqual({ deviceId: deviceId });
    });
  });

  describe('updateDevice', () => {
    it('should register a PATCH route with the correct schema and handler', async () => {
      await controller.onInit();
      const [route, options, handler] = mockRouterService.app.patch.mock.calls[0];

      expect(route).toBe(RoutesEnum.V1_STUDIO_DEVICE);
      expect(options.schema).toBeDefined();
      expect(options.preHandler).toBeDefined();
      expect(handler).toBeInstanceOf(Function);
    });

    it('should call studioDeviceDataService.updateDevice and return the correct response', async () => {
      const tableId = 'test-table-id';
      const deviceId = 'test-device-id';
      const mockResult = {
        tableId: tableId,
        deviceId: deviceId,
      };

      mockStudioDeviceDataService.updateDevice.mockReturnValue(mockResult);

      await controller.onInit();
      const [, , handler] = mockRouterService.app.patch.mock.calls[0];

      const req = { body: { deviceId: deviceId, tableId: tableId } };
      const response = await handler(req as any);

      expect(mockStudioDeviceDataService.updateDevice).toHaveBeenCalledWith({
        deviceId: deviceId,
        tableId: tableId,
      });
      expect(response).toEqual({ deviceId: deviceId, tableId: tableId });
    });
  });
});
