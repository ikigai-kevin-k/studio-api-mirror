/* eslint-disable unicorn/no-null */
// studio.service.spec.ts
import { LoggerService } from '@ikigaians/logger';
import {
  GetStudioTableCdnRequestType,
  InsertStudioTableCdnRequestType,
  UpdateStudioTableCdnRequestType,
} from 'src/studio/controller/v1/studio-cdn/studio-cdn.type';
import { StudioCdn } from 'src/studio/entities/studio-cdn.entity';
import { StudioTableStatusEnum } from 'src/studio/enums/studio.enums';
import { StudioNotFoundError } from 'src/studio/errors/studio-not-found.error';
import { StudioCdnRepository } from 'src/studio/repositories/studio-cdn/studio-cdn.repository';
import { StudioCacheService } from 'src/studio/services/studio-cache/studio-cache.service';
import { StudioCdnService } from 'src/studio/services/studio-cdn/studio-cdn.service';

const mockStudioCdnRepository = {
  getTableCdnByTableID: jest.fn(),
  insertTableCdn: jest.fn(),
  updateTableCdn: jest.fn(),
} as unknown as StudioCdnRepository;

const mockStudioCacheService = {
  getCaches: jest.fn(),
  getCache: jest.fn(),
  refreshCache: jest.fn(),
} as unknown as StudioCacheService;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

jest.mock('src/studio/utilities/cache.utility', () => ({
  isFieldsEqual: jest.fn(),
}));

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

  describe('ModuleLifecycle', () => {
    it('onInit', async () => {
      await service.onInit();
    });
  });

  describe('getStudioTableByTableID', () => {
    it('should return a studioCdn entity if found', async () => {
      const mockStudio: StudioCdn = {
        id: 1,
        tableId: 'UniTest',
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

      (mockStudioCdnRepository.getTableCdnByTableID as jest.Mock).mockResolvedValue(mockStudio);

      const result = await service.getTableCdnByTableID('UniTest');

      expect(mockStudioCdnRepository.getTableCdnByTableID).toHaveBeenCalledWith('UniTest');
      expect(result).toEqual(mockStudio);
    });

    it('should throw StudioNotFoundError if not found', async () => {
      (mockStudioCdnRepository.getTableCdnByTableID as jest.Mock).mockResolvedValue(null);

      await expect(service.getTableCdnByTableID('non-existent')).rejects.toThrow(
        StudioNotFoundError,
      );
      await expect(service.getTableCdnByTableID('non-existent')).rejects.toThrow(
        `table non-existent not found`,
      );
      expect(mockStudioCdnRepository.getTableCdnByTableID).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('getTableCdn', () => {
    it('should return a list of cdn from cache', async () => {
      const mockCacheResult = {
        tableId: 'UniTest',
        tableStatus: StudioTableStatusEnum.INACTIVE,
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

      (mockStudioCacheService.getCache as jest.Mock).mockResolvedValue(mockCacheResult);

      const request: GetStudioTableCdnRequestType = {
        tableId: 'UniTest',
      };

      const result = await service.getTableCdn(request);

      expect(mockStudioCacheService.getCache).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        tableId: 'UniTest',
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
      });
    });
  });

  describe('insertTableCdn', () => {
    it('should insert data and refresh cache', async () => {
      const request: InsertStudioTableCdnRequestType = {
        tableId: 'UniTest',
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

      const mockInsertResult = {
        TABLE_ID: 'UniTest',
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

      (mockStudioCdnRepository.insertTableCdn as jest.Mock).mockResolvedValue(mockInsertResult);

      const result = await service.insertTableCdn(request);

      expect(mockStudioCacheService.getCache).toHaveBeenCalledTimes(1);
      expect(mockStudioCdnRepository.insertTableCdn).toHaveBeenCalledTimes(1);
      expect(mockStudioCacheService.refreshCache).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        tableId: 'UniTest',
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
      });
    });
  });

  describe('updateTableCdn', () => {
    it('should update data and refresh cache', async () => {
      const request: UpdateStudioTableCdnRequestType = {
        tableId: 'UniTest',
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

      const mockInsertResult = {
        TABLE_ID: 'UniTest',
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

      (mockStudioCdnRepository.updateTableCdn as jest.Mock).mockResolvedValue(mockInsertResult);

      const result = await service.updateTableCdn(request);

      expect(mockStudioCacheService.getCache).toHaveBeenCalledTimes(1);
      expect(mockStudioCdnRepository.updateTableCdn).toHaveBeenCalledTimes(1);
      expect(mockStudioCacheService.refreshCache).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        tableId: 'UniTest',
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
      });
    });

    it('should throw StudioNotFoundError if not found', async () => {
      const request: UpdateStudioTableCdnRequestType = {
        tableId: 'UniTest',
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

      (mockStudioCdnRepository.updateTableCdn as jest.Mock).mockResolvedValue(0);

      await expect(service.updateTableCdn(request)).rejects.toThrow(StudioNotFoundError);
    });
  });
});
