/* eslint-disable unicorn/no-useless-undefined */
import { LoggerService } from '@ikigaians/logger';
import { StudioTableStatusEnum } from 'src/studio/enums/studio.enums';
import {
  GetStudioServiceInput,
  InsertStudioServiceInput,
  UpdateStudioServiceInput,
} from 'src/studio/services/studio/studio.service.type';
import { StudioRepository } from '../../repositories/studio/studio.repository';
import { StudioService } from './studio.service';

const mockStudioRepository = {
  getStudioTableByTableID: jest.fn(),
  getStudio: jest.fn(),
  insertStudioTable: jest.fn(),
  updateStudioTable: jest.fn(),
} as unknown as StudioRepository;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

describe('StudioService', () => {
  let service: StudioService;

  beforeEach(() => {
    service = new StudioService(mockStudioRepository, mockLoggerService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(service.onInit()).resolves.toBeUndefined();
    });
  });

  describe('getStudioTable', () => {
    it('should return a list of table statuses if all hit', async () => {
      const input: GetStudioServiceInput = {
        tableId: ['table1', 'table2'],
      };

      const mockResult = [
        {
          table: 'table1',
          tableStatus: StudioTableStatusEnum.INACTIVE,
          gameId: 'game1',
        },
        {
          table: 'table2',
          tableStatus: StudioTableStatusEnum.INACTIVE,
          gameId: 'game1',
        },
      ];

      (mockStudioRepository.getStudioTableByTableID as jest.Mock).mockResolvedValueOnce(
        mockResult[0],
      );
      (mockStudioRepository.getStudioTableByTableID as jest.Mock).mockResolvedValueOnce(
        mockResult[1],
      );

      const result = await service.getStudioTable(input);
      expect(result.list).toEqual(mockResult);
    });

    it('should return a list of table statuses if only one hit', async () => {
      const input: GetStudioServiceInput = {
        tableId: ['table1', 'table2'],
      };

      const mockResult = [
        {
          table: 'table1',
          tableStatus: StudioTableStatusEnum.INACTIVE,
          gameId: 'game1',
        },
      ];

      (mockStudioRepository.getStudioTableByTableID as jest.Mock).mockResolvedValueOnce(
        mockResult[0],
      );
      (mockStudioRepository.getStudioTableByTableID as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await service.getStudioTable(input);
      expect(result.list).toEqual(mockResult);
    });

    it('should return a empty list of table statuses if no one hit', async () => {
      const input: GetStudioServiceInput = {
        tableId: ['table1', 'table2'],
      };

      (mockStudioRepository.getStudioTableByTableID as jest.Mock).mockResolvedValueOnce(undefined);
      (mockStudioRepository.getStudioTableByTableID as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await service.getStudioTable(input);
      expect(result.list).toEqual([]);
    });
  });

  describe('insertStudioTable', () => {
    it('should call studioRepository.insertStudioTable', async () => {
      const request: InsertStudioServiceInput = {
        tableId: 'table1',
      };

      const mockResult = {
        table: 'table1',
        tableStatus: StudioTableStatusEnum.INACTIVE,
        gameId: 'game1',
      };

      (mockStudioRepository.insertStudioTable as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await service.insertStudioTable(request);
      expect(result).toBe(mockResult);
    });
  });

  describe('updateStudioTableStatus', () => {
    it('should update studio status and refresh the cache', async () => {
      const request: UpdateStudioServiceInput = {
        tableId: 'table-1',
        tableStatus: StudioTableStatusEnum.FAILURE,
      };

      const mockResult = {
        tableId: 'table-1',
        tableStatus: StudioTableStatusEnum.FAILURE,
      };

      (mockStudioRepository.updateStudioTable as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await service.updateStudioTable(request);

      expect(result).toBe(mockResult);
    });
  });

  describe('getStudioTableBelongTo', () => {
    it('should return data if hit', async () => {
      const mockResult = {
        tableId: 'table-1',
        tableStatus: StudioTableStatusEnum.FAILURE,
        gameId: 'gameId',
      };

      (mockStudioRepository.getStudioTableByTableID as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await service.getStudioTableBelongTo('table-1');
      expect(result).toEqual('gameId');
    });

    it('should return undefined if does not hit', async () => {
      (mockStudioRepository.getStudioTableByTableID as jest.Mock).mockResolvedValueOnce({});
      const result = await service.getStudioTableBelongTo('table-1');
      expect(result).toBeUndefined();
    });
  });
});
