/* eslint-disable unicorn/no-unreadable-array-destructuring */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from '@ikigaians/logger';
import { RoutesEnum } from 'src/global/enums/route.enum';
import { PreHandlersService, RouterService } from 'src/router';
import { StudioGameService } from 'src/studio/services/studio-game/studio-game.service';
import { StudioGameController } from './studio-game.controller';

const mockStudioGameService = {
  getGame: jest.fn(),
  insertGame: jest.fn(),
  updateGame: jest.fn(),
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

describe('StudioGameController', () => {
  let controller: StudioGameController;

  beforeAll(() => {
    controller = new StudioGameController(
      mockStudioGameService as unknown as StudioGameService,
      mockPreHandlersService as unknown as PreHandlersService,
      mockRouterService as unknown as RouterService,
      mockLoggerService as unknown as LoggerService,
    );
  });

  beforeEach(() => {
    controller = new StudioGameController(
      mockStudioGameService as unknown as StudioGameService,
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

  describe('getGame', () => {
    it('should register a GET route with the correct schema and handler', async () => {
      await controller.onInit();
      const [route, options, handler] = mockRouterService.app.get.mock.calls[0];

      expect(route).toBe(RoutesEnum.V1_STUDIO_GAME);
      expect(options.schema).toBeDefined();
      expect(options.preHandler).toBeDefined();
      expect(handler).toBeInstanceOf(Function);
    });

    it('should call studioGameService.getGame and return the correct response', async () => {
      const gameId = 'test-game-id';
      const mockResult = {
        gameId: gameId,
        primaryTableId: 'test-table-1',
        secondaryTableId: 'test-table-2',
        currentTableId: 'test-table-1',
      };

      mockStudioGameService.getGame.mockResolvedValue(mockResult);

      await controller.onInit();
      const [, , handler] = mockRouterService.app.get.mock.calls[0];

      const req = { query: { gameId: gameId } };
      const response = await handler(req as any);

      expect(mockStudioGameService.getGame).toHaveBeenCalledWith({ gameId: gameId });
      expect(response).toBe(mockResult);
    });
  });

  describe('insertGame', () => {
    it('should register a POST route with the correct schema and handler', async () => {
      await controller.onInit();
      const [route, options, handler] = mockRouterService.app.post.mock.calls[0];

      expect(route).toBe(RoutesEnum.V1_STUDIO_GAME);
      expect(options.schema).toBeDefined();
      expect(options.preHandler).toBeDefined();
      expect(handler).toBeInstanceOf(Function);
    });

    it('should call studioGameService.insertGame and return the correct response', async () => {
      const gameId = 'test-game-id';
      const mockBody = {
        gameId: gameId,
        primaryTableId: 'test-table-1',
        secondaryTableId: 'test-table-2',
        currentTableId: 'test-table-1',
      };
      const mockResult = {
        gameId: gameId,
        primaryTableId: 'test-table-1',
        secondaryTableId: 'test-table-2',
        currentTableId: 'test-table-1',
      };

      mockStudioGameService.insertGame.mockResolvedValue(mockResult);

      await controller.onInit();
      const [, , handler] = mockRouterService.app.post.mock.calls[0];

      const req = { body: mockBody };
      const response = await handler(req as any);

      expect(mockStudioGameService.insertGame).toHaveBeenCalledWith(mockBody);
      expect(response).toBe(mockResult);
    });
  });

  describe('updateGame', () => {
    it('should register a PATCH route with the correct schema and handler', async () => {
      await controller.onInit();
      const [route, options, handler] = mockRouterService.app.patch.mock.calls[0];

      expect(route).toBe(RoutesEnum.V1_STUDIO_GAME);
      expect(options.schema).toBeDefined();
      expect(options.preHandler).toBeDefined();
      expect(handler).toBeInstanceOf(Function);
    });

    it('should call studioGameService.updateGame and return the correct response', async () => {
      const gameId = 'test-game-id';
      const mockBody = {
        gameId: gameId,
        primaryTableId: 'test-table-1',
        secondaryTableId: 'test-table-2',
        currentTableId: 'test-table-1',
      };
      const mockResult = {
        gameId: gameId,
        primaryTableId: 'test-table-1',
        secondaryTableId: 'test-table-2',
        currentTableId: 'test-table-1',
      };

      mockStudioGameService.updateGame.mockResolvedValueOnce(mockResult);

      await controller.onInit();
      const [, , handler] = mockRouterService.app.patch.mock.calls[0];

      const req = { body: mockBody };
      const response = await handler(req as any);

      expect(mockStudioGameService.updateGame).toHaveBeenCalledWith(mockBody);
      expect(response).toBe(mockResult);
    });
  });
});
