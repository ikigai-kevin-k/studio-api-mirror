// studio.repository.spec.ts
/* eslint-disable unicorn/no-null */
import { DbService } from 'src/db/db.service';
import { Studio } from 'src/studio/entities/studio.entity';
import { StudioTableStatusEnum } from 'src/studio/enums/studio.enums';
import { StudioRepository } from 'src/studio/repositories/studio/studio.repository';
import {
  StudioTableResult,
  StudioTableSchema,
  UpdateStudioTableStatusEntity,
} from 'src/studio/repositories/studio/studio.repository.type';
import { UpdateResult } from 'typeorm';

const mockQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  innerJoin: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  into: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  orUpdate: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  execute: jest.fn(),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  getRawMany: jest.fn(),
  getRawOne: jest.fn(),
};

const mockRepository = {
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
};

const mockConnection = {
  getRepository: jest.fn(() => mockRepository),
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
};

const mockDbService = {
  getConnection: jest.fn(() => mockConnection),
} as unknown as DbService;

describe('StudioRepository', () => {
  let repository: StudioRepository;

  beforeEach(() => {
    repository = new StudioRepository(mockDbService);
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(repository.onInit()).resolves.toBeUndefined();
    });
  });

  describe('getStudioTableByTableID', () => {
    it('should return a studio object when found', async () => {
      const mockStudio: StudioTableResult = {
        tableId: 'uniTest',
        tableStatus: StudioTableStatusEnum.INACTIVE,
      };

      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValue(mockStudio);

      const result = await repository.getStudioTableByTableID('uniTest');

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);

      expect(mockConnection.getRepository).toHaveBeenCalledWith(Studio);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('studio');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('studio.TABLE_ID = :tableID', {
        tableID: 'uniTest',
      });
      expect(mockQueryBuilder.getRawOne).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockStudio);
    });

    it('should return null when no studio is found', async () => {
      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValue(null);

      const result = await repository.getStudioTableByTableID('non-existent-table');

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);
      expect(mockConnection.getRepository).toHaveBeenCalledWith(Studio);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.getRawOne).toHaveBeenCalledTimes(1);

      expect(result).toBeNull();
    });
  });

  describe('insertStudio', () => {
    it('should insert or update a studio and return the result', async () => {
      const mockStudio: Studio = {
        id: 1,
        tableId: 'uniTest',
        tableStatus: StudioTableStatusEnum.INACTIVE,
      };
      const mockRawResult: StudioTableSchema = {
        TABLE_ID: 'uniTest',
        TABLE_STATUS: StudioTableStatusEnum.INACTIVE,
      };
      const mockExecuteResult = { raw: [mockRawResult] };
      const mockResult: StudioTableResult = {
        tableId: 'uniTest',
        tableStatus: StudioTableStatusEnum.INACTIVE,
      };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValue(mockExecuteResult);

      const result = await repository.insertStudioTable(mockStudio);

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.insert).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.into).toHaveBeenCalledWith(Studio);
      expect(mockQueryBuilder.values).toHaveBeenCalledWith(mockStudio);
      expect(mockQueryBuilder.returning).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateStudioTableStatus', () => {
    it('should update the table status and return affected rows count', async () => {
      const updateEntity: UpdateStudioTableStatusEntity = {
        tableId: 'uniTest',
        tableStatus: StudioTableStatusEnum.INACTIVE,
      };
      const mockUpdateResult: UpdateResult = {
        generatedMaps: [],
        raw: [{ TABLE_ID: 'uniTest', TABLE_STATUS: StudioTableStatusEnum.INACTIVE }],
        affected: 1,
      };
      const mockRawResult: StudioTableResult = {
        tableId: 'uniTest',
        tableStatus: StudioTableStatusEnum.INACTIVE,
      };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValue(mockUpdateResult);

      const result = await repository.updateStudioTableStatus(updateEntity);

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.update).toHaveBeenCalledWith(Studio);
      expect(mockQueryBuilder.set).toHaveBeenCalledWith({
        tableStatus: updateEntity.tableStatus,
      });
      expect(mockQueryBuilder.where).toHaveBeenCalledWith({
        tableId: updateEntity.tableId,
      });
      expect(mockQueryBuilder.returning).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockRawResult);
    });

    it('should return undefined if no rows are affected', async () => {
      const updateEntity: UpdateStudioTableStatusEntity = {
        tableId: 'non-existent-table',
        tableStatus: StudioTableStatusEnum.INACTIVE,
      };
      const mockUpdateResult: UpdateResult = {
        generatedMaps: [],
        raw: [],
        affected: 0,
      };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValue(mockUpdateResult);

      const result = await repository.updateStudioTableStatus(updateEntity);

      expect(result).toBeUndefined();
    });
  });
});
