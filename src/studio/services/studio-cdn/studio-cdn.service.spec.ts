/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
// studio-cdn.service.spec.ts
import { LoggerService } from '@ikigaians/logger';
import {
  GetStudioTableCdnRequestType,
  InsertStudioTableCdnRequestType,
  UpdateStudioTableCdnRequestType,
} from 'src/studio/controller/v1/studio-cdn/studio-cdn.type';
import { StudioCdn } from 'src/studio/entities/studio-cdn.entity';
import { StudioNotFoundError } from 'src/studio/errors/studio-not-found.error';
import { StudioCdnRepository } from 'src/studio/repositories/studio-cdn/studio-cdn.repository';
import { InsertTableCdnResult } from 'src/studio/repositories/studio-cdn/studio-cdn.repository.type';
import { StudioCacheService } from 'src/studio/services/studio-cache/studio-cache.service';
import { StudioCdnService } from 'src/studio/services/studio-cdn/studio-cdn.service';

const mockStudioCdnRepository = {
  getTableCdnByTableID: jest.fn(),
  insertTableCdn: jest.fn(),
  updateTableCdn: jest.fn(),
} as unknown as StudioCdnRepository;

const mockStudioCacheService = {
  getCache: jest.fn(),
  refreshCache: jest.fn(),
} as unknown as StudioCacheService;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

describe('StudioCdnService', () => {
  let service: StudioCdnService;

  beforeEach(() => {
    service = new StudioCdnService(
      mockStudioCdnRepository,
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

  describe('getTableCdnByTableID', () => {
    it('should return a StudioCdn entity if found', async () => {
      const mockCdn: StudioCdn = {
        id: 1,
        tableId: 'uniTest',
        cdnDst: {
          cdnDst: {
            primary: {
              lo: 'http://ikg-cit.io/hd.flv',
              me: 'http://ikg-cit.io/hd.flv',
              hi: 'http://ikg-cit.io/hd.flv',
              hd: 'http://ikg-cit.io/hd.flv',
            },
            secondary: {
              lo: 'http://ikg-cit.io/hd.flv',
              me: 'http://ikg-cit.io/hd.flv',
              hi: 'http://ikg-cit.io/hd.flv',
              hd: 'http://ikg-cit.io/hd.flv',
            },
          },
        },
      };

      (mockStudioCdnRepository.getTableCdnByTableID as jest.Mock).mockResolvedValue(mockCdn);

      const result = await service.getTableCdnByTableID('uniTest');

      expect(mockStudioCdnRepository.getTableCdnByTableID).toHaveBeenCalledWith('uniTest');
      expect(result).toEqual(mockCdn);
    });

    it('should throw StudioNotFoundError if not found', async () => {
      (mockStudioCdnRepository.getTableCdnByTableID as jest.Mock).mockResolvedValue(null);

      await expect(service.getTableCdnByTableID('non-existent')).rejects.toThrow(
        StudioNotFoundError,
      );
      expect(mockStudioCdnRepository.getTableCdnByTableID).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('getTableCdn', () => {
    it('should return CDN data from cache and format it correctly', async () => {
      const mockCacheData = {
        tableId: 'uniTest',
        cdnDst: {
          primary: {
            lo: 'http://ikg-cit.io/hd.flv',
            me: 'http://ikg-cit.io/hd.flv',
            hi: 'http://ikg-cit.io/hd.flv',
            hd: 'http://ikg-cit.io/hd.flv',
          },
          secondary: {
            lo: 'http://ikg-cit.io/hd.flv',
            me: 'http://ikg-cit.io/hd.flv',
            hi: 'http://ikg-cit.io/hd.flv',
            hd: 'http://ikg-cit.io/hd.flv',
          },
        },
      };

      (mockStudioCacheService.getCache as jest.Mock).mockResolvedValue(mockCacheData);

      const request: GetStudioTableCdnRequestType = { tableId: 'uniTest' };

      const result = await service.getTableCdn(request);

      expect(mockStudioCacheService.getCache).toHaveBeenCalledWith('cdn', 'uniTest');
      expect(result).toEqual(mockCacheData);
    });

    it('should throw StudioNotFoundError if CDN data is not in cache', async () => {
      (mockStudioCacheService.getCache as jest.Mock).mockResolvedValue(undefined);

      const request: GetStudioTableCdnRequestType = { tableId: 'non-existent' };

      await expect(service.getTableCdn(request)).rejects.toThrow(StudioNotFoundError);
      expect(mockStudioCacheService.getCache).toHaveBeenCalledWith('cdn', 'non-existent');
    });
  });

  describe('insertTableCdn', () => {
    it('should insert a new CDN entry and refresh cache', async () => {
      const request: InsertStudioTableCdnRequestType = {
        tableId: 'uniTest',
        cdnDst: {
          primary: {
            lo: 'http://ikg-cit.io/hd.flv',
            me: 'http://ikg-cit.io/hd.flv',
            hi: 'http://ikg-cit.io/hd.flv',
            hd: 'http://ikg-cit.io/hd.flv',
          },
          secondary: {
            lo: 'http://ikg-cit.io/hd.flv',
            me: 'http://ikg-cit.io/hd.flv',
            hi: 'http://ikg-cit.io/hd.flv',
            hd: 'http://ikg-cit.io/hd.flv',
          },
        },
      };

      const mockRepoResult: InsertTableCdnResult = {
        TABLE_ID: 'uniTest',
        CDN: {
          primary: {
            lo: 'http://ikg-cit.io/hd.flv',
            me: 'http://ikg-cit.io/hd.flv',
            hi: 'http://ikg-cit.io/hd.flv',
            hd: 'http://ikg-cit.io/hd.flv',
          },
          secondary: {
            lo: 'http://ikg-cit.io/hd.flv',
            me: 'http://ikg-cit.io/hd.flv',
            hi: 'http://ikg-cit.io/hd.flv',
            hd: 'http://ikg-cit.io/hd.flv',
          },
        },
      };

      (mockStudioCdnRepository.insertTableCdn as jest.Mock).mockResolvedValue(mockRepoResult);

      const result = await service.insertTableCdn(request);

      expect(mockStudioCdnRepository.insertTableCdn).toHaveBeenCalledWith(
        expect.objectContaining({ tableId: request.tableId, cdnDst: request.cdnDst }),
      );

      const expectedCacheOutput = {
        tableId: request.tableId,
        cdnDst: request.cdnDst,
      };
      expect(mockStudioCacheService.refreshCache).toHaveBeenCalledWith('cdn', expectedCacheOutput);

      expect(result).toEqual(expectedCacheOutput);
    });
  });

  describe('updateTableCdn', () => {
    it('should update an existing CDN entry and refresh cache', async () => {
      const request: UpdateStudioTableCdnRequestType = {
        tableId: 'uniTest',
        cdnDst: {
          primary: {
            lo: 'http://ikg-cit.io/hd.flv',
            me: 'http://ikg-cit.io/hd.flv',
            hi: 'http://ikg-cit.io/hd.flv',
            hd: 'http://ikg-cit.io/hd.flv',
          },
          secondary: {
            lo: 'http://ikg-cit.io/hd.flv',
            me: 'http://ikg-cit.io/hd.flv',
            hi: 'http://ikg-cit.io/hd.flv',
            hd: 'http://ikg-cit.io/hd.flv',
          },
        },
      };
      const affectedRows = 1;

      (mockStudioCdnRepository.updateTableCdn as jest.Mock).mockResolvedValue(affectedRows);

      const result = await service.updateTableCdn(request);

      expect(mockStudioCdnRepository.updateTableCdn).toHaveBeenCalledWith(
        expect.objectContaining({ tableId: request.tableId, cdnDst: request.cdnDst }),
      );

      const expectedCacheOutput = {
        tableId: request.tableId,
        cdnDst: request.cdnDst,
      };
      expect(mockStudioCacheService.refreshCache).toHaveBeenCalledWith('cdn', expectedCacheOutput);

      expect(result).toEqual(expectedCacheOutput);
    });

    it('should throw StudioNotFoundError if no entry is updated', async () => {
      const request: UpdateStudioTableCdnRequestType = {
        tableId: 'non-existent',
        cdnDst: {
          primary: {
            lo: 'http://ikg-cit.io/hd.flv',
            me: 'http://ikg-cit.io/hd.flv',
            hi: 'http://ikg-cit.io/hd.flv',
            hd: 'http://ikg-cit.io/hd.flv',
          },
          secondary: {
            lo: 'http://ikg-cit.io/hd.flv',
            me: 'http://ikg-cit.io/hd.flv',
            hi: 'http://ikg-cit.io/hd.flv',
            hd: 'http://ikg-cit.io/hd.flv',
          },
        },
      };
      const affectedRows = 0;

      (mockStudioCdnRepository.updateTableCdn as jest.Mock).mockResolvedValue(affectedRows);

      await expect(service.updateTableCdn(request)).rejects.toThrow(StudioNotFoundError);
      expect(mockStudioCdnRepository.updateTableCdn).toHaveBeenCalledWith(
        expect.objectContaining({ tableId: request.tableId }),
      );
      expect(mockStudioCacheService.refreshCache).not.toHaveBeenCalled();
    });
  });
});
