/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-useless-undefined */
// studio-cdn.service.spec.ts
import { LoggerService } from '@ikigaians/logger';
import { CacheService } from 'src/cache/cache.service';
import {
  GetStudioTableCdnRequestType,
  InsertStudioTableCdnRequestType,
  UpdateStudioTableCdnRequestType,
} from 'src/studio/controller/v1/studio-cdn/studio-cdn.type';
import { StudioNotFoundError } from 'src/studio/errors/studio-not-found.error';
import { StudioCdnRepository } from 'src/studio/repositories/studio-cdn/studio-cdn.repository';
import { GetTableCdnResult } from 'src/studio/repositories/studio-cdn/studio-cdn.repository.type';
import { StudioCdnService } from 'src/studio/services/studio-cdn/studio-cdn.service';
import {
  GetStudioCdnServiceOutput,
  schema,
} from 'src/studio/services/studio-cdn/studio-cdn.service.type';

const mockStudioCdnRepository = {
  getTableCdnByTableID: jest.fn(),
  getStudioCdn: jest.fn(),
  insertTableCdn: jest.fn(),
  updateTableCdn: jest.fn(),
} as unknown as StudioCdnRepository;

const mockCacheService = {
  getHashAs: jest.fn(),
  setHash: jest.fn(),
  refresh: jest.fn(),
} as unknown as CacheService;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

describe('StudioCdnService', () => {
  let service: StudioCdnService;

  beforeEach(() => {
    service = new StudioCdnService(mockStudioCdnRepository, mockCacheService, mockLoggerService);
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(service.onInit()).resolves.toBeUndefined();
    });
  });

  describe('getCacheKey', () => {
    it('should return cache key', async () => {
      expect((service as any).getCacheKey('gameCode')).toBe('studio-cdn-gameCode');
    });
  });

  describe('getCache', () => {
    it('should return the correct cache entry for a given key', async () => {
      const mockCacheData: GetStudioCdnServiceOutput = {
        tableId: 'cdn1',
        cdnDst: {
          primary: {
            lo: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_lo.flv',
            me: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_me.flv',
            hi: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hi.flv',
            hd: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hd.flv',
          },
          secondary: {
            lo: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_lo.flv',
            me: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_me.flv',
            hi: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hi.flv',
            hd: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hd.flv',
          },
        },
      };
      (mockCacheService.getHashAs as jest.Mock).mockResolvedValue(mockCacheData);

      const result = await service.getCache('cdn1');
      expect(mockCacheService.getHashAs).toHaveBeenCalledWith('studio-cdn-cdn1', schema);
      expect(mockStudioCdnRepository.getTableCdnByTableID).toHaveBeenCalledTimes(0);
      expect(result).toEqual(mockCacheData);
    });

    it('should fetch from repository and set cache if cache does not exist', async () => {
      (mockCacheService.getHashAs as jest.Mock).mockResolvedValue(undefined);

      const mockCacheData: GetTableCdnResult = {
        tableId: 'cdn1',
        cdnDst: {
          primary: {
            lo: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_lo.flv',
            me: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_me.flv',
            hi: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hi.flv',
            hd: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hd.flv',
          },
          secondary: {
            lo: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_lo.flv',
            me: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_me.flv',
            hi: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hi.flv',
            hd: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hd.flv',
          },
        },
      };
      (mockStudioCdnRepository.getTableCdnByTableID as jest.Mock).mockResolvedValue(mockCacheData);

      const result = await service.getCache('cdn1');

      expect(mockCacheService.getHashAs).toHaveBeenCalledWith('studio-cdn-cdn1', schema);
      expect(mockStudioCdnRepository.getTableCdnByTableID).toHaveBeenCalledWith('cdn1');

      expect(mockCacheService.setHash).toHaveBeenCalledWith('studio-cdn-cdn1', mockCacheData);
      expect(result).toEqual(mockCacheData);
    });

    it('should return undefined if the key is not in db', async () => {
      (mockCacheService.getHashAs as jest.Mock).mockResolvedValue(null);
      (mockStudioCdnRepository.getTableCdnByTableID as jest.Mock).mockResolvedValue(undefined);

      const result = await service.getCache('cdn1');

      expect(mockCacheService.getHashAs).toHaveBeenCalledWith('studio-cdn-cdn1', schema);
      expect(mockStudioCdnRepository.getTableCdnByTableID).toHaveBeenCalledWith('cdn1');

      expect(mockCacheService.setHash).toHaveBeenCalledTimes(0);
      expect(result).toBeUndefined();
    });
  });

  describe('getTableCdn', () => {
    it('should return CDN data from cache', async () => {
      const spyGetCache = jest.spyOn(service, 'getCache');
      const mockCacheOutput: GetStudioCdnServiceOutput = {
        tableId: 'cdn1',
        cdnDst: {
          primary: {
            lo: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_lo.flv',
            me: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_me.flv',
            hi: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hi.flv',
            hd: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hd.flv',
          },
          secondary: {
            lo: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_lo.flv',
            me: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_me.flv',
            hi: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hi.flv',
            hd: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hd.flv',
          },
        },
      };
      spyGetCache.mockResolvedValue(mockCacheOutput);

      const request: GetStudioTableCdnRequestType = { tableId: 'cdn1' };
      const result = await service.getTableCdn(request);

      expect(spyGetCache).toHaveBeenCalledWith('cdn1');
      expect(result).toEqual(mockCacheOutput);
    });

    it('should throw StudioNotFoundError if CDN data is not in cache', async () => {
      const spyGetCache = jest.spyOn(service, 'getCache');
      spyGetCache.mockResolvedValue(undefined);

      const request: GetStudioTableCdnRequestType = { tableId: 'non-existent' };
      await expect(service.getTableCdn(request)).rejects.toThrow(StudioNotFoundError);
      expect(spyGetCache).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('insertTableCdn', () => {
    it('should insert a new CDN entry and refresh cache', async () => {
      const request: InsertStudioTableCdnRequestType = {
        tableId: 'cdn-new',
        cdnDst: {
          primary: {
            lo: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_lo.flv',
            me: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_me.flv',
            hi: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hi.flv',
            hd: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hd.flv',
          },
          secondary: {
            lo: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_lo.flv',
            me: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_me.flv',
            hi: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hi.flv',
            hd: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hd.flv',
          },
        },
      };
      const mockRepoResult = { TABLE_ID: 'cdn-new', CDN: {} };

      (mockStudioCdnRepository.insertTableCdn as jest.Mock).mockResolvedValue(mockRepoResult);

      const result = await service.insertTableCdn(request);

      expect(mockStudioCdnRepository.insertTableCdn).toHaveBeenCalledWith(
        expect.objectContaining({ tableId: request.tableId }),
      );
      const expectedOutput = { tableId: mockRepoResult.TABLE_ID, cdnDst: mockRepoResult.CDN };
      expect(result).toEqual(expectedOutput);
    });
  });

  describe('updateTableCdn', () => {
    it('should update an existing CDN entry and refresh cache', async () => {
      const request: UpdateStudioTableCdnRequestType = {
        tableId: 'test',
        cdnDst: {
          primary: {
            lo: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_lo.flv',
            me: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_me.flv',
            hi: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hi.flv',
            hd: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hd.flv',
          },
          secondary: {
            lo: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_lo.flv',
            me: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_me.flv',
            hi: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hi.flv',
            hd: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hd.flv',
          },
        },
      };
      const affectedRows = 1;

      (mockStudioCdnRepository.updateTableCdn as jest.Mock).mockResolvedValue(affectedRows);

      const result = await service.updateTableCdn(request);

      expect(mockStudioCdnRepository.updateTableCdn).toHaveBeenCalledWith(
        expect.objectContaining({ tableId: request.tableId }),
      );
      const expectedOutput = { tableId: request.tableId, cdnDst: request.cdnDst };
      expect(mockCacheService.refresh).toHaveBeenCalledWith('studio-cdn-test', expectedOutput);
      expect(result).toEqual(expectedOutput);
    });

    it('should throw StudioNotFoundError if no entry is updated', async () => {
      const request: UpdateStudioTableCdnRequestType = {
        tableId: 'non-existent',
        cdnDst: {
          primary: {
            lo: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_lo.flv',
            me: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_me.flv',
            hi: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hi.flv',
            hd: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hd.flv',
          },
          secondary: {
            lo: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_lo.flv',
            me: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_me.flv',
            hi: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hi.flv',
            hd: 'https://pull-ws-cit.stream.iki-utl.cc/live/sr_hd.flv',
          },
        },
      };
      const affectedRows = 0;

      (mockStudioCdnRepository.updateTableCdn as jest.Mock).mockResolvedValue(affectedRows);

      await expect(service.updateTableCdn(request)).rejects.toThrow(StudioNotFoundError);
      expect(mockCacheService.refresh).not.toHaveBeenCalled();
    });
  });
});
