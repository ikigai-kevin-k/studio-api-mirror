/* eslint-disable unicorn/prefer-node-protocol */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ws.service.spec.ts
import { IncomingMessage } from 'http';
import { AppConfigService } from 'src/config';
import { LoggerService } from 'src/log';
import { WsService } from 'src/ws/ws.service';
import { WsCloseCodeEnum } from 'src/ws/ws.service.enum';
import { WebSocket, WebSocketServer } from 'ws';

jest.mock('ws', () => {
  const mockWebSocket = {
    on: jest.fn(),
    close: jest.fn(),
    send: jest.fn(),
    readyState: 1, // WebSocket.OPEN
  };
  const mockWebSocketServer = {
    on: jest.fn(),
    once: jest.fn(),
    close: jest.fn((callback) => callback()),
    clients: new Set([mockWebSocket]),
  };
  return { WebSocketServer: jest.fn(() => mockWebSocketServer), WebSocket: mockWebSocket };
});

const mockLoggerService = {
  info: jest.fn(),
  warn: jest.fn(),
} as unknown as LoggerService;

const mockAppConfigService = {
  wsConfig: {
    token: 'test-token',
    port: 8080,
  },
} as unknown as AppConfigService;

describe('WsService', () => {
  let service: WsService;
  let mockWss: any;

  beforeEach(() => {
    service = new WsService(mockLoggerService, mockAppConfigService);
    mockWss = new WebSocketServer({ port: 8080 });
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should create a WebSocketServer and handle listening event', async () => {
      const promise = service.onInit();
      mockWss.once.mock.calls[0][1]();

      await expect(promise).resolves.toBeUndefined();
      expect(WebSocketServer).toHaveBeenCalledWith({ port: mockAppConfigService.wsConfig.port });
      expect(mockWss.once).toHaveBeenCalledWith('listening', expect.any(Function));
    });

    it('should create a WebSocketServer and handle error event', async () => {
      const promise = service.onInit();
      const mockError = new Error('Test error');

      mockWss.once.mock.calls[1][1](mockError);

      await expect(promise).rejects.toThrow('Test error');
      expect(WebSocketServer).toHaveBeenCalledWith({ port: mockAppConfigService.wsConfig.port });
      expect(mockWss.once).toHaveBeenCalledWith('error', expect.any(Function));
    });
  });

  describe('handleConnect', () => {
    let mockWs: any;
    let mockReq: IncomingMessage;

    beforeEach(() => {
      mockWs = {
        on: jest.fn(),
        close: jest.fn(),
      } as unknown as WebSocket;
      mockReq = {
        url: 'ws://localhost:8080/?token=test-token',
        headers: { host: 'localhost:8080' },
      } as unknown as IncomingMessage;
    });

    it('should handle a valid connection and set up event listeners', async () => {
      const onInitPromise = service.onInit();
      mockWss.once.mock.calls[0][1]();

      await onInitPromise;

      const connectionHandler = mockWss.on.mock.calls[0][1];

      const notifySpy = jest.spyOn(service as any, 'notify');

      connectionHandler(mockWs, mockReq);

      expect(mockLoggerService.info).toHaveBeenCalledWith('create WsService');
      expect(mockWs.on).toHaveBeenCalledWith('message', expect.any(Function));
      expect(mockWs.on).toHaveBeenCalledWith('close', expect.any(Function));
      expect(notifySpy).toHaveBeenCalledWith('connection', expect.any(URLSearchParams), mockWs);
    });

    it('should close the connection with an unauthorized error for invalid token', async () => {
      mockReq.url = 'ws://localhost:8080/?token=invalid';

      const onInitPromise = service.onInit();
      mockWss.once.mock.calls[0][1]();

      await onInitPromise;

      const connectionHandler = mockWss.on.mock.calls[0][1];

      connectionHandler(mockWs, mockReq);

      expect(mockLoggerService.warn).toHaveBeenCalledWith('Invalid credentials');
      expect(mockWs.close).toHaveBeenCalledWith(
        WsCloseCodeEnum.Unauthorized,
        'Invalid credentials',
      );
    });
  });

  describe('subscribe', () => {
    it('should add a callback to the observers map', () => {
      const mockCallback = jest.fn();
      service.subscribe('connection', mockCallback);
      expect(service['observers'].get('connection')).toContain(mockCallback);
    });

    it('should return a function to unsubscribe the callback', () => {
      const mockCallback = jest.fn();
      const unsubscribe = service.subscribe('connection', mockCallback);
      expect(service['observers'].get('connection')).toContain(mockCallback);

      unsubscribe();
      expect(service['observers'].get('connection')).not.toContain(mockCallback);
    });
  });

  describe('notify', () => {
    it('should call all registered observers for an event', () => {
      const mockCallback1 = jest.fn();
      const mockCallback2 = jest.fn();
      service.subscribe('message', mockCallback1);
      service.subscribe('message', mockCallback2);

      const mockWs = {} as WebSocket;
      const mockQuery = new URLSearchParams('token=test');
      const mockData = 'test-message';

      service['notify']('message', mockQuery, mockWs, mockData);

      expect(mockCallback1).toHaveBeenCalledWith(mockQuery, mockWs, mockData);
      expect(mockCallback2).toHaveBeenCalledWith(mockQuery, mockWs, mockData);
    });
  });

  describe('broadcast', () => {
    it('should send message to all open clients', async () => {
      const mockClient1 = { readyState: 1, OPEN: 1, send: jest.fn() } as any;
      const mockClient2 = { readyState: 0, OPEN: 1, send: jest.fn() } as any;
      const mockClients = new Set([mockClient1, mockClient2]);

      const onInitPromise = service.onInit();
      mockWss.once.mock.calls[0][1]();

      await onInitPromise;

      mockWss.clients = mockClients;

      service.broadcast('test-broadcast');

      expect(mockClient1.send).toHaveBeenCalledWith('test-broadcast');
      expect(mockClient2.send).not.toHaveBeenCalled();
    });
  });

  describe('onDispose', () => {
    it('should close all clients and the server', async () => {
      const mockClient1 = { readyState: 1, OPEN: 1, close: jest.fn() } as any;
      const mockClient2 = { readyState: 0, OPEN: 1, close: jest.fn() } as any;
      const mockClients = new Set([mockClient1, mockClient2]);

      const onInitPromise = service.onInit();
      mockWss.once.mock.calls[0][1]();

      await onInitPromise;

      Object.defineProperty(mockWss, 'clients', { value: mockClients });

      await expect(service.onDispose()).resolves.toBeUndefined();

      expect(mockClient1.close).toHaveBeenCalledWith(
        WsCloseCodeEnum.GoingAway,
        'StudioAPI shutting down',
      );
      expect(mockClient2.close).not.toHaveBeenCalledWith(
        WsCloseCodeEnum.GoingAway,
        'StudioAPI shutting down',
      );
      expect(mockWss.close).toHaveBeenCalledTimes(1);
    });
  });
});
