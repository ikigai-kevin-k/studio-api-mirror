/* eslint-disable unicorn/no-null */
// studio-cdn.service.spec.ts
import { LoggerService } from '@ikigaians/logger';
import {
  GetStudioTableCdnRequestType,
  UpsertStudioTableCdnRequestType,
} from 'src/studio/controller/v1/studio-cdn/studio-cdn.type';
import { StudioCdn } from 'src/studio/entities/studio-cdn.entity';
import { StudioNotFoundError } from 'src/studio/errors/studio-not-found.error';
import { StudioCacheResult } from 'src/studio/model/studio-cache/studio-cache.model';
import { StudioCdnRepository } from 'src/studio/repositories/studio-cdn/studio-cdn.repository';
import { StudioCacheService } from 'src/studio/services/studio-cache/studio-cache.service';
import { StudioCdnService } from 'src/studio/services/studio-cdn/studio-cdn.service';
import { isFieldsEqual } from 'src/studio/utilities/cache.utility';

// Mock 掉所有依賴的服務
const mockStudioCdnRepository = {
  getTableCdnByTableID: jest.fn(),
  upsertTableCdn: jest.fn(),
} as unknown as StudioCdnRepository;

const mockStudioCacheService = {
  getCaches: jest.fn(),
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

  describe('getTableCdnByTableID', () => {
    it('should return a StudioCdn entity if found', async () => {
      const mockCdnEntity: StudioCdn = {
        id: 1,
        tableId: 'uniTest',
        primaryHd: 'http://ikg-cit.io/hd.flv',
        primaryHi: 'http://ikg-cit.io/hi.flv',
        primaryMe: 'http://ikg-cit.io/me.flv',
        primaryLo: 'http://ikg-cit.io/lo.flv',
        secondaryHd: 'http://ikg-cit.io/hd.flv',
        secondaryHi: 'http://ikg-cit.io/hi.flv',
        secondaryMe: 'http://ikg-cit.io/me.flv',
        secondaryLo: 'http://ikg-cit.io/lo.flv',
      };

      (mockStudioCdnRepository.getTableCdnByTableID as jest.Mock).mockResolvedValue(mockCdnEntity);

      const result = await service.getTableCdnByTableID('uniTest');

      expect(mockStudioCdnRepository.getTableCdnByTableID).toHaveBeenCalledWith('uniTest');
      expect(result).toEqual(mockCdnEntity);
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
      const mockCacheMap = new Map<string, StudioCacheResult>();
      mockCacheMap.set('UniTest', {
        tableId: 'UniTest',
        primaryHd: 'http://ikg-cit.io/hd.flv',
        primaryHi: 'http://ikg-cit.io/hi.flv',
        primaryMe: 'http://ikg-cit.io/me.flv',
        primaryLo: 'http://ikg-cit.io/lo.flv',
        secondaryHd: 'http://ikg-cit.io/hd.flv',
        secondaryHi: 'http://ikg-cit.io/hi.flv',
        secondaryMe: 'http://ikg-cit.io/me.flv',
        secondaryLo: 'http://ikg-cit.io/lo.flv',
      } as StudioCacheResult);

      (mockStudioCacheService.getCaches as jest.Mock).mockResolvedValue(mockCacheMap);

      const request: GetStudioTableCdnRequestType = { tableId: 'UniTest' };

      const result = await service.getTableCdn(request);

      expect(mockStudioCacheService.getCaches).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        tableId: 'UniTest',
        primary: {
          lo: 'http://ikg-cit.io/lo.flv',
          me: 'http://ikg-cit.io/me.flv',
          hi: 'http://ikg-cit.io/hi.flv',
          hd: 'http://ikg-cit.io/hd.flv',
        },
        secondary: {
          lo: 'http://ikg-cit.io/lo.flv',
          me: 'http://ikg-cit.io/me.flv',
          hi: 'http://ikg-cit.io/hi.flv',
          hd: 'http://ikg-cit.io/hd.flv',
        },
      });
    });

    it('should throw StudioNotFoundError if CDN data is not in cache', async () => {
      const mockCacheMap = new Map<string, StudioCacheResult>();
      (mockStudioCacheService.getCaches as jest.Mock).mockResolvedValue(mockCacheMap);

      const request: GetStudioTableCdnRequestType = { tableId: 'non-existent' };

      await expect(service.getTableCdn(request)).rejects.toThrow(StudioNotFoundError);
      expect(mockStudioCacheService.getCaches).toHaveBeenCalledTimes(1);
    });
  });

  describe('upsertTableCdn', () => {
    it('should return data directly without upserting if it is equal to cache data', async () => {
      // Mock isFieldsEqual to return true
      (isFieldsEqual as jest.Mock).mockReturnValue(true);

      const mockCacheMap = new Map<string, StudioCacheResult>();
      mockCacheMap.set('UniTest', {
        tableId: 'UniTest',
        primaryHd: 'http://ikg-cit.io/hd.flv',
        primaryHi: 'http://ikg-cit.io/hi.flv',
        primaryMe: 'http://ikg-cit.io/me.flv',
        primaryLo: 'http://ikg-cit.io/lo.flv',
        secondaryHd: 'http://ikg-cit.io/hd.flv',
        secondaryHi: 'http://ikg-cit.io/hi.flv',
        secondaryMe: 'http://ikg-cit.io/me.flv',
        secondaryLo: 'http://ikg-cit.io/lo.flv',
      } as StudioCacheResult);

      (mockStudioCacheService.getCaches as jest.Mock).mockResolvedValue(mockCacheMap);

      const request: UpsertStudioTableCdnRequestType = {
        tableId: 'UniTest',
        primary: {
          lo: 'http://ikg-cit.io/lo.flv',
          me: 'http://ikg-cit.io/me.flv',
          hi: 'http://ikg-cit.io/hi.flv',
          hd: 'http://ikg-cit.io/hd.flv',
        },
        secondary: {
          lo: 'http://ikg-cit.io/lo.flv',
          me: 'http://ikg-cit.io/me.flv',
          hi: 'http://ikg-cit.io/hi.flv',
          hd: 'http://ikg-cit.io/hd.flv',
        },
      };

      const result = await service.upsertTableCdn(request);

      expect(mockStudioCacheService.getCaches).toHaveBeenCalledTimes(1);
      expect(isFieldsEqual).toHaveBeenCalledTimes(1);
      expect(mockStudioCdnRepository.upsertTableCdn).not.toHaveBeenCalled();
      expect(mockStudioCacheService.refreshCache).not.toHaveBeenCalled();

      expect(result).toEqual({
        tableId: 'UniTest',
        primary: request.primary,
        secondary: request.secondary,
      });
    });

    it('should upsert data and refresh cache if it is not equal to cache data', async () => {
      // Mock isFieldsEqual to return false
      (isFieldsEqual as jest.Mock).mockReturnValue(false);

      const mockCacheMap = new Map<string, StudioCacheResult>();
      mockCacheMap.set('UniTest', {
        tableId: 'UniTest',
        primaryHd: 'http://ikg-cit.io/hd.flv',
        primaryHi: 'http://ikg-cit.io/hi.flv',
        primaryMe: 'http://ikg-cit.io/me.flv',
        primaryLo: 'http://ikg-cit.io/lo.flv',
        secondaryHd: 'http://ikg-cit.io/hd.flv',
        secondaryHi: 'http://ikg-cit.io/hi.flv',
        secondaryMe: 'http://ikg-cit.io/me.flv',
        secondaryLo: 'http://ikg-cit.io/lo.flv',
      } as StudioCacheResult);

      (mockStudioCacheService.getCaches as jest.Mock).mockResolvedValue(mockCacheMap);

      const request: UpsertStudioTableCdnRequestType = {
        tableId: 'UniTest',
        primary: {
          lo: 'http://ikg-qat.io/lo.flv',
          me: 'http://ikg-qat.io/me.flv',
          hi: 'http://ikg-qat.io/hi.flv',
          hd: 'http://ikg-qat.io/hd.flv',
        },
        secondary: {
          lo: 'http://ikg-qat.io/lo.flv',
          me: 'http://ikg-qat.io/me.flv',
          hi: 'http://ikg-qat.io/hi.flv',
          hd: 'http://ikg-qat.io/hd.flv',
        },
      };

      const mockUpsertResult = {
        TABLE_ID: 'UniTest',
        PRIMARY_HD: 'http://ikg-qat.io/hd.flv',
        PRIMARY_HI: 'http://ikg-qat.io/hi.flv',
        PRIMARY_ME: 'http://ikg-qat.io/me.flv',
        PRIMARY_LO: 'http://ikg-qat.io/lo.flv',
        SECONDARY_HD: 'http://ikg-qat.io/hd.flv',
        SECONDARY_HI: 'http://ikg-qat.io/hi.flv',
        SECONDARY_ME: 'http://ikg-qat.io/me.flv',
        SECONDARY_LO: 'http://ikg-qat.io/lo.flv',
      };

      (mockStudioCdnRepository.upsertTableCdn as jest.Mock).mockResolvedValue(mockUpsertResult);

      const result = await service.upsertTableCdn(request);

      expect(mockStudioCacheService.getCaches).toHaveBeenCalledTimes(1);
      expect(isFieldsEqual).toHaveBeenCalledTimes(1);
      expect(mockStudioCdnRepository.upsertTableCdn).toHaveBeenCalledTimes(1);
      expect(mockStudioCacheService.refreshCache).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        tableId: 'UniTest',
        primary: request.primary,
        secondary: request.secondary,
      });
    });
  });
});
