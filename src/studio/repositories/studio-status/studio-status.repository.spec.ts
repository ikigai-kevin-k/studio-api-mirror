// studio-status.repository.spec.ts
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable unicorn/no-empty-file */

// studio-status.repository.spec.ts
/* eslint-disable unicorn/no-null */
import { DbService } from 'src/db/db.service';
import { StudioStatusRepository } from 'src/studio/repositories/studio-status/studio-status.repository';
import {
  GetTableStatusResult,
  InsertTableStatusResult,
  UpdateTableStatusEntity,
} from 'src/studio/repositories/studio-status/studio-status.repository.type';
import { UpdateResult } from 'typeorm';
import { StudioStatus } from '../../entities/studio-status.entity';

const mockQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  into: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  setParameters: jest.fn().mockReturnThis(),
  execute: jest.fn(),
  getOne: jest.fn(),
  getMany: jest.fn(),
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

describe('StudioStatusRepository', () => {
  let repository: StudioStatusRepository;

  beforeEach(() => {
    repository = new StudioStatusRepository(mockDbService);
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(repository.onInit()).resolves.toBeUndefined();
    });
  });

  describe('getTableStatusByTableID', () => {
    it('should return a StudioStatus object when found', async () => {
      const mockStatus: GetTableStatusResult = {
        tableId: 'status-table-1',
        uptime: 1,
        timestamp: 0,
        maintenance: false,
        sdp: 'OK',
        idp: 'OK',
        broker: 'OK',
        zCam: 'OK',
        roulette: 'OK',
        shaker: 'OK',
        barcodeScanner: 'OK',
        nfcScanner: 'OK',
      };

      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValue(mockStatus);

      const result = await repository.getTableStatusByTableID('status-table-1');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith('studio.TABLE_ID = :tableID', {
        tableID: 'status-table-1',
      });
      expect(result).toEqual(mockStatus);
    });

    it('should return null when no StudioStatus is found', async () => {
      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValue(null);
      const result = await repository.getTableStatusByTableID('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('insertTableStatus', () => {
    it('should insert a new status and return the result', async () => {
      const mockTableId = 'status-table-1';
      const mockRawResult: InsertTableStatusResult = {
        TABLE_ID: mockTableId,
        UPTIME: 0,
        TIMESTAMP: new Date(),
        MAINTENANCE: false,
        SDP: '',
        IDP: '',
        BROKER: '',
        Z_CAM: '',
        ROULETTE: '',
        SHAKER: '',
        BARCODE_SCANNER: '',
        NFC_SCANNER: '',
      };
      const mockExecuteResult = { raw: [mockRawResult] };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValue(mockExecuteResult);

      const result = await repository.insertTableStatus(mockTableId);

      expect(mockQueryBuilder.insert).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.into).toHaveBeenCalledWith(StudioStatus);
      expect(mockQueryBuilder.values).toHaveBeenCalledWith({ tableId: mockTableId });
      expect(mockQueryBuilder.returning).toHaveBeenCalledWith([
        'tableId',
        'uptime',
        'timestamp',
        'maintenance',
        'sdp',
        'idp',
        'broker',
        'zCam',
        'roulette',
        'shaker',
        'barcodeScanner',
        'nfcScanner',
      ]);
      expect(result).toEqual(mockRawResult);
    });
  });

  describe('updateTableStatus', () => {
    it('should update the status and return affected rows count', async () => {
      const tableId = 'status-table-1';
      const updateEntity: UpdateTableStatusEntity = { uptime: 5, sdp: 'OK' };
      const mockUpdateResult: UpdateResult = {
        generatedMaps: [],
        raw: [],
        affected: 1,
      };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValue(mockUpdateResult);

      const result = await repository.updateTableStatus(tableId, updateEntity);

      expect(mockQueryBuilder.update).toHaveBeenCalledWith(StudioStatus);
      expect(mockQueryBuilder.set).toHaveBeenCalledWith(updateEntity);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('tableId = :tableId', { tableId });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'NOT (uptime = :uptime AND sdp = :sdp)',
      );
      expect(mockQueryBuilder.setParameters).toHaveBeenCalledWith(updateEntity);
      expect(result).toBe(1);
    });

    it('should handle an empty entity without throwing an error', async () => {
      const tableId = 'status-table-1';
      const updateEntity: UpdateTableStatusEntity = {};
      const mockUpdateResult: UpdateResult = {
        generatedMaps: [],
        raw: [],
        affected: 1,
      };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValue(mockUpdateResult);

      const result = await repository.updateTableStatus(tableId, updateEntity);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith('tableId = :tableId', { tableId });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('NOT ()');
      expect(result).toBe(1);
    });

    it('should return 0 if no rows are affected but query succeeds', async () => {
      const tableId = 'status-table-1';
      const updateEntity: UpdateTableStatusEntity = { uptime: 5 };
      const mockUpdateResult: UpdateResult = {
        generatedMaps: [],
        raw: [],
        affected: 0,
      };
      (mockQueryBuilder.execute as jest.Mock).mockResolvedValue(mockUpdateResult);
      const result = await repository.updateTableStatus(tableId, updateEntity);
      expect(result).toBe(0);
    });

    it('should return -1 if affected is null', async () => {
      const tableId = 'status-table-1';
      const updateEntity: UpdateTableStatusEntity = { uptime: 5 };
      const mockUpdateResult = {
        generatedMaps: [],
        raw: [],
        affected: null,
      };
      (mockQueryBuilder.execute as jest.Mock).mockResolvedValue(mockUpdateResult);
      const result = await repository.updateTableStatus(tableId, updateEntity);
      expect(result).toBe(-1);
    });
  });
});
