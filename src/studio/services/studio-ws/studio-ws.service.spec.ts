// studio-ws.service.spec.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { LoggerService } from '@ikigaians/logger';
import { StudioCacheService } from 'src/studio/services/studio-cache/studio-cache.service';
import { StudioStatusService } from 'src/studio/services/studio-status/studio-status.service';
import { StudioWsService } from 'src/studio/services/studio-ws/studio-ws.service';
import { WsService } from 'src/ws/ws.service';
import { WsCloseCodeEnum } from 'src/ws/ws.service.enum';
import { WebSocket } from 'ws';

const mockWsService = {
  subscribe: jest.fn(),
} as unknown as WsService;

const mockStudioStatusService = {
  updateTableStatus: jest.fn(),
} as unknown as StudioStatusService;

const mockStudioCacheService = {
  getCache: jest.fn(),
} as unknown as StudioCacheService;

const mockLoggerService = {
  info: jest.fn(),
} as unknown as LoggerService;

describe('StudioWsService', () => {
  let service: StudioWsService;

  beforeEach(() => {
    service = new StudioWsService(
      mockWsService,
      mockStudioStatusService,
      mockStudioCacheService,
      mockLoggerService,
    );
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should subscribe to connection, close, and message events', async () => {
      const mockUnsubscribe = jest.fn();
      (mockWsService.subscribe as jest.Mock).mockReturnValue(mockUnsubscribe);

      await service.onInit();

      expect(mockWsService.subscribe).toHaveBeenCalledTimes(3);
      expect(mockWsService.subscribe).toHaveBeenCalledWith('connection', expect.any(Function));
      expect(mockWsService.subscribe).toHaveBeenCalledWith('close', expect.any(Function));
      expect(mockWsService.subscribe).toHaveBeenCalledWith('message', expect.any(Function));
    });
  });

  describe('onDispose', () => {
    it('should call all unsubscribe functions', async () => {
      const mockUnsubscribe1 = jest.fn();
      const mockUnsubscribe2 = jest.fn();
      const mockUnsubscribe3 = jest.fn();
      (service as any).unSubscribes = [mockUnsubscribe1, mockUnsubscribe2, mockUnsubscribe3];

      await service.onDispose();

      expect(mockUnsubscribe1).toHaveBeenCalledTimes(1);
      expect(mockUnsubscribe2).toHaveBeenCalledTimes(1);
      expect(mockUnsubscribe3).toHaveBeenCalledTimes(1);
    });
  });

  describe('onConnect', () => {
    it('should close connection if cache is not found', async () => {
      (mockStudioCacheService.getCache as jest.Mock).mockResolvedValue(null);
      const mockWs = {
        close: jest.fn(),
        send: jest.fn(),
      } as unknown as WebSocket;
      const mockQuery = new URLSearchParams('id=table-1');

      await (service as any).onConnect(mockQuery, mockWs);

      expect(mockStudioCacheService.getCache).toHaveBeenCalledWith('status', 'table-1');
      expect(mockWs.close).toHaveBeenCalledWith(
        WsCloseCodeEnum.Unauthorized,
        'Unknown tableId = table-1',
      );
      expect(mockWs.send).not.toHaveBeenCalled();
    });

    it('should send welcome message and log info if cache is found', async () => {
      (mockStudioCacheService.getCache as jest.Mock).mockResolvedValue({ tableId: 'table-1' });
      const mockWs = {
        close: jest.fn(),
        send: jest.fn(),
      } as unknown as WebSocket;
      const mockQuery = new URLSearchParams('id=table-1&device=device-A');

      await (service as any).onConnect(mockQuery, mockWs);

      expect(mockStudioCacheService.getCache).toHaveBeenCalledWith('status', 'table-1');
      expect(mockWs.close).not.toHaveBeenCalled();
    });
  });

  describe('onDisconnect', () => {
    it('should log the disconnection event', () => {
      const mockQuery = new URLSearchParams('id=table-1&device=device-A');

      (service as any).onDisconnect(mockQuery);
    });
  });

  describe('onMessage', () => {
    it('should update status and send result for valid JSON message', async () => {
      const mockQuery = new URLSearchParams('id=table-1&device=device-A');
      const mockWs = { send: jest.fn() } as unknown as WebSocket;
      const mockData = JSON.stringify({ maintenance: true });
      const mockUpdateResult = { tableId: 'table-1', maintenance: true };

      (mockStudioStatusService.updateTableStatus as jest.Mock).mockResolvedValue(mockUpdateResult);

      await (service as any).onMessage(mockQuery, mockWs, mockData);

      expect(mockStudioStatusService.updateTableStatus).toHaveBeenCalledWith({
        tableId: 'table-1',
        maintenance: true,
      });
      expect(mockWs.send).toHaveBeenCalledWith(JSON.stringify(mockUpdateResult));
    });

    it('should send an error message for invalid JSON message', async () => {
      const mockQuery = new URLSearchParams('id=table-1&device=device-A');
      const mockWs = { send: jest.fn() } as unknown as WebSocket;
      const mockData = 'invalid json';

      await (service as any).onMessage(mockQuery, mockWs, mockData);

      expect(mockWs.send).toHaveBeenCalledWith(`Invalid Payload Data: ${mockData}`);
      expect(mockStudioStatusService.updateTableStatus).not.toHaveBeenCalled();
    });
  });
});
