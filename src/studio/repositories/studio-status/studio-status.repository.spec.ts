// studio-status.repository.spec.ts
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable unicorn/no-empty-file */

// studio-status.repository.spec.ts
/* eslint-disable unicorn/no-null */
import { DbService } from 'src/db/db.service';
import { StudioStatusRepository } from 'src/studio/repositories/studio-status/studio-status.repository';
import {
  TableStatusResult,
  TableStatusSchema,
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
      const mockStatus: TableStatusResult = {
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
      const timestamp = new Date();
      const mockRawResult: TableStatusSchema = {
        TABLE_ID: mockTableId,
        UPTIME: 0,
        TIMESTAMP: timestamp,
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
      const mockResult: TableStatusResult = {
        tableId: mockTableId,
        uptime: 0,
        timestamp: timestamp.getTime(),
        maintenance: false,
        sdp: '',
        idp: '',
        broker: '',
        zCam: '',
        roulette: '',
        shaker: '',
        barcodeScanner: '',
        nfcScanner: '',
      };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValue(mockExecuteResult);

      const result = await repository.insertTableStatus(mockTableId);

      expect(mockQueryBuilder.insert).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.into).toHaveBeenCalledWith(StudioStatus);
      expect(mockQueryBuilder.values).toHaveBeenCalledWith({ tableId: mockTableId });
      expect(mockQueryBuilder.returning).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateTableStatus', () => {
    it('should update the status and return affected rows count', async () => {
      const tableId = 'status-table-1';
      const timestamp = new Date();
      const updateEntity: UpdateTableStatusEntity = { uptime: 5, sdp: 'OK' };
      const mockUpdateResult: UpdateResult = {
        generatedMaps: [],
        raw: [
          {
            TABLE_ID: tableId,
            UPTIME: 0,
            TIMESTAMP: timestamp,
            MAINTENANCE: false,
            SDP: '',
            IDP: '',
            BROKER: '',
            Z_CAM: '',
            ROULETTE: '',
            SHAKER: '',
            BARCODE_SCANNER: '',
            NFC_SCANNER: '',
          },
        ],
        affected: 1,
      };
      const mockResult: TableStatusResult = {
        tableId: tableId,
        uptime: 0,
        timestamp: timestamp.getTime(),
        maintenance: false,
        sdp: '',
        idp: '',
        broker: '',
        zCam: '',
        roulette: '',
        shaker: '',
        barcodeScanner: '',
        nfcScanner: '',
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
      expect(mockQueryBuilder.returning).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockResult);
    });

    it('should return undefined if no rows are affected but query succeeds', async () => {
      const tableId = 'status-table-1';
      const updateEntity: UpdateTableStatusEntity = { uptime: 5 };
      const mockUpdateResult: UpdateResult = {
        generatedMaps: [],
        raw: [],
        affected: 0,
      };
      (mockQueryBuilder.execute as jest.Mock).mockResolvedValue(mockUpdateResult);
      const result = await repository.updateTableStatus(tableId, updateEntity);
      expect(result).toBeUndefined();
    });
  });
});
