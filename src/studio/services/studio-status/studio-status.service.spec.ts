/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
// studio-status.service.spec.ts
import { LoggerService } from '@ikigaians/logger';
import {
  GetTableStatusRequestType,
  InsertTableStatusRequestType,
  UpdateTableStatusRequestType,
} from 'src/studio/controller/v1/studio-status/studio-status.type';
import { StudioStatus } from 'src/studio/entities/studio-status.entity';
import { StudioDeviceStatusEnum, StudioServiceStatusEnum } from 'src/studio/enums/studio.enums';
import { StudioNotFoundError } from 'src/studio/errors/studio-not-found.error';
import { StudioStatusRepository } from 'src/studio/repositories/studio-status/studio-status.repository';
import { InsertTableStatusResult } from 'src/studio/repositories/studio-status/studio-status.repository.type';
import { StudioCacheService } from 'src/studio/services/studio-cache/studio-cache.service';
import { StudioStatusService } from 'src/studio/services/studio-status/studio-status.service';
import {
  GetTableStatusOutput,
  InsertTableStatusOutput,
} from 'src/studio/services/studio-status/studio-status.service.type';

const mockStudioStatusRepository = {
  getTableStatusByTableID: jest.fn(),
  insertTableStatus: jest.fn(),
  updateTableStatus: jest.fn(),
  updateTableStatusByWebSocket: jest.fn(),
} as unknown as StudioStatusRepository;

const mockStudioCacheService = {
  getCache: jest.fn(),
  refreshCache: jest.fn(),
} as unknown as StudioCacheService;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

describe('StudioStatusService', () => {
  let service: StudioStatusService;

  beforeEach(() => {
    service = new StudioStatusService(
      mockStudioStatusRepository,
      mockStudioCacheService,
      mockLoggerService,
    );
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(service.onInit()).resolves.toBeUndefined();
    });
  });

  describe('getTableStatusByTableID', () => {
    it('should return a StudioStatus entity if found', async () => {
      const mockStatus: StudioStatus = {
        id: 1,
        tableId: 'uniTest',
        uptime: 10,
        timestamp: new Date(),
        maintenance: false,
        sdp: StudioServiceStatusEnum.STANDBY,
        idp: StudioServiceStatusEnum.STANDBY,
        broker: StudioDeviceStatusEnum.DOWN,
        zCam: StudioDeviceStatusEnum.DOWN,
        roulette: StudioDeviceStatusEnum.DOWN,
        shaker: StudioDeviceStatusEnum.DOWN,
        barcodeScanner: StudioDeviceStatusEnum.DOWN,
        nfcScanner: StudioDeviceStatusEnum.DOWN,
      };
      (mockStudioStatusRepository.getTableStatusByTableID as jest.Mock).mockResolvedValue(
        mockStatus,
      );

      const result = await service.getTableStatusByTableID('uniTest');

      expect(mockStudioStatusRepository.getTableStatusByTableID).toHaveBeenCalledWith('uniTest');
      expect(result).toEqual(mockStatus);
    });

    it('should throw StudioNotFoundError if not found', async () => {
      (mockStudioStatusRepository.getTableStatusByTableID as jest.Mock).mockResolvedValue(null);

      await expect(service.getTableStatusByTableID('non-existent')).rejects.toThrow(
        StudioNotFoundError,
      );
      expect(mockStudioStatusRepository.getTableStatusByTableID).toHaveBeenCalledWith(
        'non-existent',
      );
    });
  });

  describe('getTableStatus', () => {
    it('should return status data from cache', async () => {
      const mockCacheData: GetTableStatusOutput = {
        tableId: 'uniTest',
        uptime: 10,
        timestamp: Date.now(),
        maintenance: false,
        sdp: StudioServiceStatusEnum.STANDBY,
        idp: StudioServiceStatusEnum.STANDBY,
        broker: StudioDeviceStatusEnum.DOWN,
        zCam: StudioDeviceStatusEnum.DOWN,
        roulette: StudioDeviceStatusEnum.DOWN,
        shaker: StudioDeviceStatusEnum.DOWN,
        barcodeScanner: StudioDeviceStatusEnum.DOWN,
        nfcScanner: StudioDeviceStatusEnum.DOWN,
      };

      (mockStudioCacheService.getCache as jest.Mock).mockResolvedValue(mockCacheData);

      const request: GetTableStatusRequestType = { tableId: 'uniTest' };

      const result = await service.getTableStatus(request);

      expect(mockStudioCacheService.getCache).toHaveBeenCalledWith('status', 'uniTest');
      expect(result).toEqual(mockCacheData);
    });

    it('should throw StudioNotFoundError if status data is not in cache', async () => {
      (mockStudioCacheService.getCache as jest.Mock).mockResolvedValue(undefined);

      const request: GetTableStatusRequestType = { tableId: 'non-existent' };

      await expect(service.getTableStatus(request)).rejects.toThrow(StudioNotFoundError);
      expect(mockStudioCacheService.getCache).toHaveBeenCalledWith('status', 'non-existent');
    });
  });

  describe('insertTableStatus', () => {
    it('should insert a new status entry and refresh cache', async () => {
      const request: InsertTableStatusRequestType = { tableId: 'uniTest' };
      const now = new Date();

      const mockRepoResult: InsertTableStatusResult = {
        TABLE_ID: 'uniTest',
        UPTIME: 0,
        TIMESTAMP: now,
        MAINTENANCE: false,
        SDP: StudioServiceStatusEnum.DOWN,
        IDP: StudioServiceStatusEnum.DOWN,
        BROKER: StudioDeviceStatusEnum.DOWN,
        Z_CAM: StudioDeviceStatusEnum.DOWN,
        ROULETTE: StudioDeviceStatusEnum.DOWN,
        SHAKER: StudioDeviceStatusEnum.DOWN,
        BARCODE_SCANNER: StudioDeviceStatusEnum.DOWN,
        NFC_SCANNER: StudioDeviceStatusEnum.DOWN,
      };

      (mockStudioStatusRepository.insertTableStatus as jest.Mock).mockResolvedValue(mockRepoResult);

      const result = await service.insertTableStatus(request);

      expect(mockStudioStatusRepository.insertTableStatus).toHaveBeenCalledWith('uniTest');

      const expectedOutput: InsertTableStatusOutput = {
        tableId: 'uniTest',
        uptime: 0,
        timestamp: result.timestamp,
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

      expect(mockStudioCacheService.refreshCache).toHaveBeenCalledWith('status', expectedOutput);
      expect(result).toEqual(expectedOutput);
    });
  });

  describe('updateTableStatus', () => {
    it('should update status and refresh the cache', async () => {
      const request: UpdateTableStatusRequestType = {
        tableId: 'status-table-1',
        uptime: 100,
        sdp: StudioServiceStatusEnum.STANDBY,
      };
      const affectedRows = 1;
      (mockStudioStatusRepository.updateTableStatus as jest.Mock).mockResolvedValue(affectedRows);

      const result = await service.updateTableStatus(request);

      const expectedEntity = { uptime: 100, sdp: StudioServiceStatusEnum.STANDBY };
      expect(mockStudioStatusRepository.updateTableStatus).toHaveBeenCalledWith(
        'status-table-1',
        expectedEntity,
      );

      const expectedOutput = {
        tableId: request.tableId,
        ...expectedEntity,
      };
      expect(mockStudioCacheService.refreshCache).toHaveBeenCalledWith('status', expectedOutput);

      expect(result).toEqual(expectedOutput);
    });

    it('should throw StudioNotFoundError if no rows are updated', async () => {
      const request: UpdateTableStatusRequestType = {
        tableId: 'non-existent',
        uptime: 100,
      };
      const affectedRows = 0;
      (mockStudioStatusRepository.updateTableStatus as jest.Mock).mockResolvedValue(affectedRows);

      await expect(service.updateTableStatus(request)).rejects.toThrow(StudioNotFoundError);
      expect(mockStudioCacheService.refreshCache).not.toHaveBeenCalled();
    });
  });

  describe('updateTableStatusByWebSocket', () => {
    it('should update status and refresh the cache', async () => {
      const tableId = 'status-table-1';
      const input = { maintenance: true };
      const affectedRows = 1;
      (mockStudioStatusRepository.updateTableStatus as jest.Mock).mockResolvedValue(affectedRows);

      const result = await service.updateTableStatusByWebSocket(tableId, input);

      const expectedEntity = { maintenance: true };
      expect(mockStudioStatusRepository.updateTableStatus).toHaveBeenCalledWith(
        tableId,
        expectedEntity,
      );

      const expectedOutput = {
        tableId: tableId,
        ...expectedEntity,
      };
      expect(mockStudioCacheService.refreshCache).toHaveBeenCalledWith('status', expectedOutput);

      expect(result).toEqual(expectedOutput);
    });

    it('should throw StudioNotFoundError if no rows are updated', async () => {
      const tableId = 'non-existent';
      const input = { maintenance: true };
      const affectedRows = 0;
      (mockStudioStatusRepository.updateTableStatus as jest.Mock).mockResolvedValue(affectedRows);

      await expect(service.updateTableStatusByWebSocket(tableId, input)).rejects.toThrow(Error);
      expect(mockStudioCacheService.refreshCache).not.toHaveBeenCalled();
    });
  });
});
