// studio-cdn.repository.spec.ts
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { DbService } from 'src/db/db.service';
import { StudioCdn } from 'src/studio/entities/studio-cdn.entity';
import { StudioCdnRepository } from 'src/studio/repositories/studio-cdn/studio-cdn.repository';
import {
  GetTableCdnQuery,
  GetTableCdnResult,
  InsertTableCdnResult,
  UpdateTableCdnEntity,
} from 'src/studio/repositories/studio-cdn/studio-cdn.repository.type';
import { GetStudioCdnServiceOutput } from 'src/studio/services/studio-cdn/studio-cdn.service.type';
import { UpdateResult } from 'typeorm';

const mockQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  into: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  execute: jest.fn(),
  getOne: jest.fn(),
  getRawOne: jest.fn(),
  getRawMany: jest.fn(),
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

describe('StudioCdnRepository', () => {
  let repository: StudioCdnRepository;

  beforeEach(() => {
    repository = new StudioCdnRepository(mockDbService);
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(repository.onInit()).resolves.toBeUndefined();
    });
  });

  describe('getTableCdnByTableID', () => {
    it('should return a StudioCdn object when found', async () => {
      const mockCdn: StudioCdn = {
        id: 1,
        tableId: 'cdn-table-1',
        cdnDst: { hi: 'path' },
      };
      (mockQueryBuilder.getOne as jest.Mock).mockResolvedValue(mockCdn);

      const result = await repository.getTableCdnByTableID('cdn-table-1');

      expect(mockConnection.getRepository).toHaveBeenCalledWith(StudioCdn);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('studio.TABLE_ID = :tableID', {
        tableID: 'cdn-table-1',
      });
      expect(result).toEqual(mockCdn);
    });

    it('should return null when no StudioCdn is found', async () => {
      (mockQueryBuilder.getOne as jest.Mock).mockResolvedValue(null);
      const result = await repository.getTableCdnByTableID('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('getStudioCdn', () => {
    it('should return an array of GetStudioCdnServiceOutput', async () => {
      const mockResults: GetStudioCdnServiceOutput[] = [
        { tableId: 'cdn-1', cdnDst: { primary: { lo: 'path' } } },
      ];
      (mockQueryBuilder.getRawMany as jest.Mock).mockResolvedValue(mockResults);

      const result = await repository.getStudioCdn();

      expect(mockConnection.createQueryBuilder).toHaveBeenCalledWith(StudioCdn, 'studio');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith([
        'studio."TABLE_ID" as "tableId"',
        'studio."CDN" as "cdnDst"',
      ]);
      expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResults);
    });
  });

  describe('getTableCdn', () => {
    it('should return a GetTableCdnResult object when found', async () => {
      const query: GetTableCdnQuery = { tableId: 'cdn-table-1' };
      const mockResult: GetTableCdnResult = { cdnDst: { primary: { lo: 'path' } } };
      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValue(mockResult);

      const result = await repository.getTableCdn(query);

      expect(mockQueryBuilder.select).toHaveBeenCalledWith(['studio."CDN" as "cdn"']);
      expect(mockQueryBuilder.from).toHaveBeenCalledWith(StudioCdn, 'studio');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('studio.TABLE_ID = :tableId', {
        tableId: 'cdn-table-1',
      });
      expect(result).toEqual(mockResult);
    });

    it('should return undefined when no result is found', async () => {
      const query: GetTableCdnQuery = { tableId: 'non-existent' };
      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValue(undefined);
      const result = await repository.getTableCdn(query);
      expect(result).toBeUndefined();
    });
  });

  describe('insertTableCdn', () => {
    it('should insert a StudioCdn and return the result', async () => {
      const mockCdn: StudioCdn = {
        id: 1,
        tableId: 'cdn-table-1',
        cdnDst: { hi: 'path' },
      };
      const mockRawResult: InsertTableCdnResult = {
        TABLE_ID: 'cdn-table-1',
        CDN: { hi: 'path' },
      };
      const mockExecuteResult = { raw: [mockRawResult] };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValue(mockExecuteResult);

      const result = await repository.insertTableCdn(mockCdn);

      expect(mockQueryBuilder.insert).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.into).toHaveBeenCalledWith(StudioCdn);
      expect(mockQueryBuilder.values).toHaveBeenCalledWith(mockCdn);
      expect(mockQueryBuilder.returning).toHaveBeenCalledWith(['tableId', 'cdnDst']);
      expect(result).toEqual(mockRawResult);
    });
  });

  describe('updateTableCdn', () => {
    it('should update the cdn and return affected rows count', async () => {
      const updateEntity: UpdateTableCdnEntity = {
        tableId: 'cdn-table-1',
        cdnDst: { primary: { lo: 'new-path' } },
      };
      const mockUpdateResult: UpdateResult = {
        generatedMaps: [],
        raw: [],
        affected: 1,
      };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValue(mockUpdateResult);

      const result = await repository.updateTableCdn(updateEntity);

      expect(mockQueryBuilder.update).toHaveBeenCalledWith(StudioCdn);
      expect(mockQueryBuilder.set).toHaveBeenCalledWith({ cdnDst: updateEntity.cdnDst });
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('tableId = :tableId', {
        tableId: 'cdn-table-1',
      });
      expect(mockQueryBuilder.returning).toHaveBeenCalledWith(['tableId', 'cdnDst']);
      expect(result).toBe(1);
    });

    it('should return 0 if no rows are affected', async () => {
      const updateEntity: UpdateTableCdnEntity = {
        tableId: 'non-existent',
        cdnDst: { primary: {} },
      };
      const mockUpdateResult: UpdateResult = {
        generatedMaps: [],
        raw: [],
        affected: 0,
      };
      (mockQueryBuilder.execute as jest.Mock).mockResolvedValue(mockUpdateResult);
      const result = await repository.updateTableCdn(updateEntity);
      expect(result).toBe(0);
    });

    it('should return -1 if affected is null', async () => {
      const updateEntity: UpdateTableCdnEntity = {
        tableId: 'non-existent',
        cdnDst: { primary: {} },
      };
      const mockUpdateResult = {
        generatedMaps: [],
        raw: [],
        affected: null,
      };
      (mockQueryBuilder.execute as jest.Mock).mockResolvedValue(mockUpdateResult);
      const result = await repository.updateTableCdn(updateEntity);
      expect(result).toBe(-1);
    });
  });
});
