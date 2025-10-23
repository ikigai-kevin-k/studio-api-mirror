/* eslint-disable unicorn/prefer-node-protocol */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ws.service.spec.ts
import { WebSocket } from '@fastify/websocket';
import { LoggerService } from '@ikigaians/logger';
import { WsConnection } from './ws.connection';
import { WsCloseCodeEnum, WsResponseType } from './ws.service.enum';

const mockConnectWebSocket = {
  on: jest.fn(),
  send: jest.fn(),
  close: jest.fn(),
  OPEN: 1,
  CLOSED: 0,
  readyState: 1,
} as unknown as WebSocket;

const mockDisConnectWebSocket = {
  on: jest.fn(),
  send: jest.fn(),
  close: jest.fn(),
  OPEN: 1,
  CLOSED: 0,
  readyState: 0,
} as unknown as WebSocket;

const mockLoggerService = {
  info: jest.fn(),
  warn: jest.fn(),
} as unknown as LoggerService;

describe('WsConnection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getter', () => {
    it('should return true if ws connected', () => {
      const mockConnect = new WsConnection('id', mockConnectWebSocket, mockLoggerService);
      expect(mockConnect.isOpen).toEqual(true);
    });

    it('should return false if ws connected', () => {
      const mockConnect = new WsConnection('id', mockConnectWebSocket, mockLoggerService);
      expect(mockConnect.isClosed).toEqual(false);
    });

    it('should return false if ws disconnected', () => {
      const mockConnect = new WsConnection('id', mockDisConnectWebSocket, mockLoggerService);
      expect(mockConnect.isOpen).toEqual(false);
    });

    it('should return true if ws disconnected', () => {
      const mockConnect = new WsConnection('id', mockDisConnectWebSocket, mockLoggerService);
      expect(mockConnect.isClosed).toEqual(true);
    });
  });

  describe('function', () => {
    let connect: WsConnection;
    beforeEach(() => {
      connect = new WsConnection('id', mockConnectWebSocket, mockLoggerService);
      jest.clearAllMocks();
    });

    describe('onClose', () => {
      it('should register ws event', () => {
        const mockInput = jest.fn();
        connect.onClose(mockInput);
        expect(mockConnectWebSocket.on).toHaveBeenCalled();
      });
    });

    describe('send', () => {
      it('should call ws send', () => {
        const mockOutput = { timestamp: '' };
        connect.send(WsResponseType.Ack, mockOutput);
        expect(mockConnectWebSocket.send).toHaveBeenCalledWith(
          JSON.stringify({ type: WsResponseType.Ack, data: mockOutput }),
        );
      });
    });

    describe('close', () => {
      it('should call ws close', () => {
        const mockOutput = { code: 10_000, message: '' };
        connect.close(WsCloseCodeEnum.GoingAway, mockOutput);
        expect(mockConnectWebSocket.close).toHaveBeenCalledWith(
          WsCloseCodeEnum.GoingAway,
          JSON.stringify({ type: WsResponseType.Kick, error: mockOutput }),
        );
      });
    });

    describe('error', () => {
      it('should call ws send', () => {
        const mockOutput = { code: 10_000, message: '' };
        connect.error(mockOutput);
        expect(mockConnectWebSocket.send).toHaveBeenCalledWith(
          JSON.stringify({ type: WsResponseType.Error, error: mockOutput }),
        );
      });
    });
  });
});
