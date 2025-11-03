/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-useless-undefined */
import { LoggerService } from '@ikigaians/logger';
import { StudioGameRepository } from 'src/studio/repositories/studio-game/studio-game.repository';
import { StudioGameService } from './studio-game.service';
import {
  GetStudioGameServiceInput,
  InsertStudioGameServiceInput,
  StudioGameServiceOutput,
  UpdateStudioGameServiceInput,
} from './studio-game.service.type';

const mockStudioGameRepository = {
  getGameByID: jest.fn(),
  insertGame: jest.fn(),
  updateGame: jest.fn(),
} as unknown as StudioGameRepository;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

describe('StudioGameService', () => {
  let service: StudioGameService;

  beforeEach(() => {
    service = new StudioGameService(mockStudioGameRepository, mockLoggerService);
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(service.onInit()).resolves.toBeUndefined();
    });
  });

  describe('getGame', () => {
    it('should return data from cache', async () => {
      const input: GetStudioGameServiceInput = {
        gameId: 'gameCode',
      };

      const output: StudioGameServiceOutput = {
        gameId: 'gameCode',
        primaryTableId: 'tableCode-1',
        secondaryTableId: 'tableCode-2',
        currentTableId: 'tableCode-1',
      };

      (mockStudioGameRepository.getGameByID as jest.Mock).mockResolvedValueOnce(output);

      const result = await service.getGame(input);
      expect(result).toBe(output);
    });
  });

  describe('insertGame', () => {
    it('should insert a new game', async () => {
      const input: InsertStudioGameServiceInput = {
        gameId: 'gameCode',
        primaryTableId: 'tableCode-1',
        secondaryTableId: 'tableCode-2',
        currentTableId: 'tableCode-1',
      };

      const output: StudioGameServiceOutput = {
        gameId: 'gameCode',
        primaryTableId: 'tableCode-1',
        secondaryTableId: 'tableCode-2',
        currentTableId: 'tableCode-1',
      };

      (mockStudioGameRepository.insertGame as jest.Mock).mockResolvedValueOnce(output);

      const result = await service.insertGame(input);
      expect(result).toBe(output);
    });
  });

  describe('updateGame', () => {
    it('should update a game entity', async () => {
      const input: UpdateStudioGameServiceInput = {
        gameId: 'gameCode',
        primaryTableId: 'tableCode-1',
        secondaryTableId: 'tableCode-2',
        currentTableId: 'tableCode-1',
      };

      const output: StudioGameServiceOutput = {
        gameId: 'gameCode',
        primaryTableId: 'tableCode-1',
        secondaryTableId: 'tableCode-2',
        currentTableId: 'tableCode-1',
      };

      (mockStudioGameRepository.updateGame as jest.Mock).mockResolvedValueOnce(output);

      const result = await service.updateGame(input);

      expect(result).toBe(output);
    });
  });

  describe('switchCurrentTable', () => {
    it('should switch to secondary if input is primary', async () => {
      const gameCode = 'gameCode';
      const mockResultBefore = {
        gameId: 'gameCode',
        primaryTableId: 'tableCode-1',
        secondaryTableId: 'tableCode-2',
        currentTableId: 'tableCode-1',
      };

      const mockResultAfter = {
        gameId: 'gameCode',
        primaryTableId: 'tableCode-1',
        secondaryTableId: 'tableCode-2',
        currentTableId: 'tableCode-2',
      };

      (mockStudioGameRepository.getGameByID as jest.Mock).mockResolvedValueOnce(mockResultBefore);
      (mockStudioGameRepository.updateGame as jest.Mock).mockResolvedValueOnce(mockResultAfter);

      const result = await service.switchCurrentTable(gameCode);
      expect(result).toEqual('tableCode-2');
      expect(mockStudioGameRepository.updateGame).toHaveBeenLastCalledWith({
        gameId: 'gameCode',
        currentTableId: 'tableCode-2',
      });
    });

    it('should switch to primary if input is secondary', async () => {
      const gameCode = 'gameCode';
      const mockResultBefore = {
        gameId: 'gameCode',
        primaryTableId: 'tableCode-2',
        secondaryTableId: 'tableCode-1',
        currentTableId: 'tableCode-1',
      };

      const mockResultAfter = {
        gameId: 'gameCode',
        primaryTableId: 'tableCode-2',
        secondaryTableId: 'tableCode-1',
        currentTableId: 'tableCode-2',
      };

      (mockStudioGameRepository.getGameByID as jest.Mock).mockResolvedValueOnce(mockResultBefore);
      (mockStudioGameRepository.updateGame as jest.Mock).mockResolvedValueOnce(mockResultAfter);

      const result = await service.switchCurrentTable(gameCode);
      expect(result).toEqual('tableCode-2');
      expect(mockStudioGameRepository.updateGame).toHaveBeenLastCalledWith({
        gameId: 'gameCode',
        currentTableId: 'tableCode-2',
      });
    });
  });
});
