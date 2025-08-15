// studio-status.repository.spec.ts
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { DbService } from 'src/db/db.service';
import { StudioStatus } from 'src/studio/entities/studio-status.entity';
import { StudioDeviceStatusEnum, StudioServiceStatusEnum } from 'src/studio/enums/studio.enums';
import { StudioStatusRepository } from 'src/studio/repositories/studio-status/studio-status.repository';
import {
  InsertTableStatusResult,
  UpdateTableStatusEntity,
} from 'src/studio/repositories/studio-status/studio-status.repository.type';
import {
  GetTableStatusQuery,
  TableStatusResult,
} from 'src/studio/services/studio-status/studio-status.service.type';
import { UpdateResult } from 'typeorm';

const mockQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  setParameters: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  into: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  execute: jest.fn(),
  getOne: jest.fn(),
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
      const mockStatus: StudioStatus = {
        id: 1,
        tableId: 'uniTest',
        uptime: 1,
        timestamp: new Date(),
        maintenance: false,
        sdp: StudioServiceStatusEnum.DOWN,
        idp: StudioServiceStatusEnum.DOWN,
        broker: StudioDeviceStatusEnum.DOWN,
        zCam: StudioDeviceStatusEnum.DOWN,
        roulette: StudioDeviceStatusEnum.DOWN,
        shaker: StudioDeviceStatusEnum.DOWN,
        barcodeScanner: StudioDeviceStatusEnum.DOWN,
        nfcScanner: StudioDeviceStatusEnum.DOWN,
      };

      (mockQueryBuilder.getOne as jest.Mock).mockResolvedValue(mockStatus);

      const result = await repository.getTableStatusByTableID('uniTest');

      expect(mockConnection.getRepository).toHaveBeenCalledWith(StudioStatus);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('studio.TABLE_ID = :tableID', {
        tableID: 'uniTest',
      });
      expect(result).toEqual(mockStatus);
    });

    it('should return null when no StudioStatus is found', async () => {
      (mockQueryBuilder.getOne as jest.Mock).mockResolvedValue(null);

      const result = await repository.getTableStatusByTableID('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getTableStatus', () => {
    it('should return a TableStatusResult object when found', async () => {
      const query: GetTableStatusQuery = { tableId: 'uniTest' };
      const mockResult: TableStatusResult = {
        uptime: 1,
        timestamp: new Date(),
        maintenance: false,
        sdp: StudioServiceStatusEnum.DOWN,
        idp: StudioServiceStatusEnum.DOWN,
        broker: StudioDeviceStatusEnum.DOWN,
        zCam: StudioDeviceStatusEnum.DOWN,
        roulette: StudioDeviceStatusEnum.DOWN,
        shaker: StudioDeviceStatusEnum.DOWN,
        barcodeScanner: StudioDeviceStatusEnum.DOWN,
        nfcScanner: StudioDeviceStatusEnum.DOWN,
      };

      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValue(mockResult);

      const result = await repository.getTableStatus(query);

      expect(mockQueryBuilder.select).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.from).toHaveBeenCalledWith(StudioStatus, 'studio');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('studio.TABLE_ID = :tableId', {
        tableId: 'uniTest',
      });
      expect(result).toEqual(mockResult);
    });

    it('should return undefined when no result is found', async () => {
      const query: GetTableStatusQuery = { tableId: 'non-existent' };
      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValue(undefined);

      const result = await repository.getTableStatus(query);

      expect(result).toBeUndefined();
    });
  });

  describe('insertTableStatus', () => {
    it('should insert a new status and return the result', async () => {
      const mockTableId = 'uniTest';
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
      expect(mockQueryBuilder.returning).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockRawResult);
    });
  });

  describe('updateTableStatus', () => {
    it('should update the status and return affected rows count', async () => {
      const tableId = 'uniTest';
      const updateEntity: UpdateTableStatusEntity = {
        uptime: 5,
        sdp: StudioServiceStatusEnum.DOWN,
      };
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
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('(uptime != :uptime OR sdp != :sdp)');
      expect(mockQueryBuilder.setParameters).toHaveBeenCalledWith(updateEntity);
      expect(result).toBe(1);
    });

    it('should return 0 if no rows are affected but query succeeds', async () => {
      const tableId = 'uniTest';
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
      const tableId = 'uniTest';
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
