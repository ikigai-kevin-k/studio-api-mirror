import fastifyWebsocket, { WebSocket } from '@fastify/websocket';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { RoutesEnum } from 'src/global/enums/route.enum';
import { LoggerService } from 'src/log';
import { RouterService } from 'src/router';
import { WsController } from './ws.controller';
import { WsService } from './ws.service';

const mockFastify = {
  get: jest.fn(),
  register: jest.fn((callback) => {
    if (callback === fastifyWebsocket) {
      return Promise.resolve();
    }
    return callback(mockFastify);
  }),
} as unknown as FastifyInstance;

const mockWsService = {
  handleConnect: jest.fn(),
} as unknown as WsService;

const mockRouterService = {
  app: mockFastify,
} as unknown as RouterService;

const mockLoggerService = {
  info: jest.fn(),
} as unknown as LoggerService;

const getRouteHandler = (callIndex: number = 0) => {
  return (mockFastify.get as jest.Mock).mock.calls[callIndex][2];
};

describe('WsController', () => {
  let controller: WsController;

  beforeEach(() => {
    controller = new WsController(mockWsService, mockRouterService, mockLoggerService);
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should register fastifyWebsocket plugin and all routes', async () => {
      await controller.onInit();

      expect(mockFastify.register).toHaveBeenCalledWith(fastifyWebsocket);

      expect(mockFastify.register).toHaveBeenCalledTimes(2);

      expect(mockFastify.get).toHaveBeenCalledWith(
        RoutesEnum.V1_WS_CONNECT,
        expect.objectContaining({
          schema: expect.objectContaining({
            summary: expect.any(String),
            tags: ['ws'],
          }),
          websocket: true,
        }),
        expect.any(Function),
      );
    });
  });

  describe('connect Handler', () => {
    let handler: (ws: WebSocket, req: FastifyRequest) => Promise<void>;
    const mockWs = {} as WebSocket;

    beforeEach(async () => {
      await controller.onInit();
      handler = getRouteHandler();
    });

    it('should call wsService.handleConnect with the WebSocket and URL query params', async () => {
      const mockReq = {
        url: '/?id=user1&token=abc',
        headers: { host: 'localhost' },
      } as unknown as FastifyRequest;

      await handler(mockWs, mockReq);

      const expectedQuery = new URL('http://localhost?id=user1&token=abc').searchParams;

      expect(mockWsService.handleConnect).toHaveBeenCalledWith(mockWs, expectedQuery);
    });

    it('should correctly handle query params without an ID or token', async () => {
      const mockReq = {
        url: '/',
        headers: { host: 'localhost' },
      } as unknown as FastifyRequest;

      await handler(mockWs, mockReq);

      const expectedQuery = new URL('http://localhost').searchParams;

      expect(mockWsService.handleConnect).toHaveBeenCalledWith(mockWs, expectedQuery);
    });
  });
});
