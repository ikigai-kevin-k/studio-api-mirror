/* eslint-disable unicorn/prefer-node-protocol */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ws.service.spec.ts
import { WebSocket } from '@fastify/websocket';
import { AppConfigService } from 'src/config';
import { LoggerService } from 'src/log';
import { SlackService } from 'src/slack/slack.service';
import { WsService } from './ws.service';
import { WsResponseType } from './ws.service.enum';

const mockSlackService = {
  broadcast: jest.fn(),
} as unknown as SlackService;

const mockLoggerService = {
  info: jest.fn(),
  warn: jest.fn(),
} as unknown as LoggerService;

const mockAppConfigService = {
  wsConfig: {
    token: 'test-token',
  },
} as unknown as AppConfigService;

describe('WsService', () => {
  let service: WsService;

  beforeEach(() => {
    service = new WsService(mockSlackService, mockLoggerService, mockAppConfigService);
    jest.clearAllMocks();
  });

  describe('handleConnect', () => {
    let mockWs: any;

    beforeEach(() => {
      mockWs = {
        on: jest.fn(),
        close: jest.fn(),
      } as unknown as WebSocket;
    });

    it('should handle a valid connection and set up event listeners', async () => {
      const mockQuery = new URL('ws://localhost:8080/?id=test-id&token=test-token').searchParams;
      const notifySpy = jest.spyOn(service as any, 'notify');
      expect(mockQuery.get('id')).toEqual('test-id');
      expect(mockQuery.get('token')).toEqual('test-token');

      service.handleConnect(mockWs, mockQuery);

      expect(mockWs.on).toHaveBeenCalledWith('message', expect.any(Function));
      expect(mockWs.on).toHaveBeenCalledWith('close', expect.any(Function));
      expect(notifySpy).toHaveBeenCalledWith('connection', expect.any(URLSearchParams), mockWs);
    });

    it('should close the connection with an unauthorized error for invalid token', async () => {
      const mockQuery = new URL('ws://localhost:8080/?id=test-id&token=fake-token').searchParams;

      service.handleConnect(mockWs, mockQuery);

      expect(mockWs.close).toHaveBeenCalled();
    });

    it('should close the connection with an unauthorized error for empty id', async () => {
      const mockQuery = new URL('ws://localhost:8080/?token=test-token').searchParams;

      service.handleConnect(mockWs, mockQuery);

      expect(mockWs.close).toHaveBeenCalled();
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
      const mockData = { message: 'test-message' };

      service['notify']('message', mockQuery, mockWs, mockData);

      expect(mockCallback1).toHaveBeenCalled();
      expect(mockCallback2).toHaveBeenCalled();
    });
  });

  describe('leave', () => {
    it('should kick a connect if it still works', () => {
      const listeners = (service as any).listeners;
      const mockClient1 = { readyState: 1, OPEN: 1, close: jest.fn() } as any;
      listeners.set('mockClient1', mockClient1);

      (service as any).leave('mockClient1');
      expect(mockClient1.close).toHaveBeenCalled();
      expect(listeners.get('mockClient1')).toBeUndefined();
    });

    it('should only remove a connect if it does not works', () => {
      const listeners = (service as any).listeners;
      const mockClient1 = { readyState: 4, OPEN: 1, close: jest.fn() } as any;
      listeners.set('mockClient1', mockClient1);

      (service as any).leave('mockClient1');
      expect(mockClient1.close).not.toHaveBeenCalled();
      expect(listeners.get('mockClient1')).toBeUndefined();
    });

    it('do nothing if id does not exit', () => {
      const listeners = (service as any).listeners;
      const mockClient1 = { readyState: 1, OPEN: 1, close: jest.fn() } as any;
      listeners.set('mockClient1', mockClient1);

      (service as any).leave('mockClient2');
      expect(mockClient1.close).not.toHaveBeenCalled();
      expect(listeners.get('mockClient1')).toBe(mockClient1);
    });
  });

  describe('broadcast', () => {
    it('should send message to all open clients', async () => {
      const listeners = (service as any).listeners;
      const mockClient1 = { readyState: 1, OPEN: 1, send: jest.fn() } as any;
      const mockClient2 = { readyState: 0, OPEN: 1, send: jest.fn() } as any;
      listeners.set('mockClient1', mockClient1);
      listeners.set('mockClient2', mockClient2);

      const mockInput = { timestamp: '' };

      service.broadcast(WsResponseType.Ack, mockInput);

      expect(mockClient1.send).toHaveBeenCalledWith(
        JSON.stringify({ type: WsResponseType.Ack, data: mockInput }),
      );
      expect(mockClient2.send).not.toHaveBeenCalled();
    });
  });

  describe('ack', () => {
    it('should send message to all open clients', async () => {
      const spyBroadcast = jest.spyOn(service as any, 'broadcast');
      (service as any).ack();
      expect(spyBroadcast).toHaveBeenCalled();
    });
  });

  describe('onDispose', () => {
    it('should close all clients and the server', async () => {
      const listeners = (service as any).listeners;
      const mockClient1 = { readyState: 1, OPEN: 1, close: jest.fn() } as any;
      const mockClient2 = { readyState: 0, OPEN: 1, close: jest.fn() } as any;

      listeners.set('mockClient1', mockClient1);
      listeners.set('mockClient2', mockClient2);

      await service.onDispose();
      expect(mockClient1.close).toHaveBeenCalled();
      expect(mockClient2.close).not.toHaveBeenCalled();
    });
  });
});
