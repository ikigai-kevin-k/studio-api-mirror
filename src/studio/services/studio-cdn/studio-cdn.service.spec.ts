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
import { StudioCdn } from 'src/studio/entities/studio-cdn.entity';
import { StudioNotFoundError } from 'src/studio/errors/studio-not-found.error';
import { StudioCdnRepository } from 'src/studio/repositories/studio-cdn/studio-cdn.repository';
import { StudioCdnService } from 'src/studio/services/studio-cdn/studio-cdn.service';
import { GetTableCdnOutput } from 'src/studio/services/studio-cdn/studio-cdn.service.type';

// Mock 掉所有依賴的服務
const mockStudioCdnRepository = {
  getTableCdnByTableID: jest.fn(),
  getStudioCdnCache: jest.fn(),
  insertTableCdn: jest.fn(),
  updateTableCdn: jest.fn(),
} as unknown as StudioCdnRepository;

const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
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

  describe('getTableCdnByTableID', () => {
    it('should return a StudioCdn entity if found', async () => {
      const mockCdn: StudioCdn = {
        id: 1,
        tableId: 'cdn-table-1',
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
      (mockStudioCdnRepository.getTableCdnByTableID as jest.Mock).mockResolvedValue(mockCdn);

      const result = await service.getTableCdnByTableID('cdn-table-1');

      expect(mockStudioCdnRepository.getTableCdnByTableID).toHaveBeenCalledWith('cdn-table-1');
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

  describe('getCaches', () => {
    it('should return data from cache if it exists', async () => {
      const mockCacheData = new Map<string, GetTableCdnOutput>();
      mockCacheData.set('cdn1', {
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
      });
      const mockCacheString = JSON.stringify([...mockCacheData]);

      (mockCacheService.get as jest.Mock).mockResolvedValue(mockCacheString);
      const spyGetCdnCache = jest.spyOn(mockStudioCdnRepository, 'getStudioCdnCache');

      const result = await service.getCaches();

      expect(mockCacheService.get).toHaveBeenCalledWith('cdn');
      expect(spyGetCdnCache).not.toHaveBeenCalled();
      expect(mockCacheService.set).not.toHaveBeenCalled();
      expect(result).toEqual(mockCacheData);
    });

    it('should fetch from repository and set cache if cache does not exist', async () => {
      (mockCacheService.get as jest.Mock).mockResolvedValue(null);

      const mockRepositoryData: GetTableCdnOutput[] = [
        {
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
        },
      ];
      (mockStudioCdnRepository.getStudioCdnCache as jest.Mock).mockResolvedValue(
        mockRepositoryData,
      );

      const result = await service.getCaches();

      expect(mockCacheService.get).toHaveBeenCalledWith('cdn');
      expect(mockStudioCdnRepository.getStudioCdnCache).toHaveBeenCalledTimes(1);

      const expectedMap = new Map();
      expectedMap.set('cdn1', mockRepositoryData[0]);
      const expectedCacheString = JSON.stringify([...expectedMap]);

      expect(mockCacheService.set).toHaveBeenCalledWith('cdn', expectedCacheString, 86_400);
      expect(result).toEqual(expectedMap);
    });
  });

  describe('getCache', () => {
    it('should return the correct cache entry for a given key', async () => {
      const spyGetCaches = jest.spyOn(service, 'getCaches');
      const mockCacheData = new Map<string, GetTableCdnOutput>();
      const entry: GetTableCdnOutput = {
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
      mockCacheData.set('cdn1', entry);
      spyGetCaches.mockResolvedValue(mockCacheData);

      const result = await service.getCache('cdn1');

      expect(spyGetCaches).toHaveBeenCalledTimes(1);
      expect(result).toEqual(entry);
    });

    it('should return undefined if the key is not in cache', async () => {
      const spyGetCaches = jest.spyOn(service, 'getCaches');
      const mockCacheData = new Map<string, GetTableCdnOutput>();
      spyGetCaches.mockResolvedValue(mockCacheData);

      const result = await service.getCache('non-existent');

      expect(spyGetCaches).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });
  });

  describe('refreshCache', () => {
    it('should merge new data with existing cache and set it', async () => {
      const initialCacheData = new Map<string, GetTableCdnOutput>();
      initialCacheData.set('cdn1', {
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
      });
      const spyGetCaches = jest.spyOn(service, 'getCaches').mockResolvedValue(initialCacheData);

      const newCacheData: GetTableCdnOutput = {
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

      await service.refreshCache(newCacheData);

      const expectedUpdatedMap = new Map(initialCacheData);
      expectedUpdatedMap.set('cdn1', newCacheData);
      const expectedCacheString = JSON.stringify([...expectedUpdatedMap]);

      expect(spyGetCaches).toHaveBeenCalledTimes(1);
      expect(mockCacheService.set).toHaveBeenCalledWith('cdn', expectedCacheString, 86_400);
    });

    it('should filter undefined values during merge', async () => {
      const initialCacheData = new Map<string, GetTableCdnOutput>();
      initialCacheData.set('cdn1', {
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
      });
      const spyGetCaches = jest.spyOn(service, 'getCaches').mockResolvedValue(initialCacheData);

      const newCacheData: any = {
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

      await service.refreshCache(newCacheData);

      const expectedResult = {
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
      const expectedMap = new Map();
      expectedMap.set('cdn1', expectedResult);
      const expectedCacheString = JSON.stringify([...expectedMap]);

      expect(mockCacheService.set).toHaveBeenCalledWith('cdn', expectedCacheString, 86_400);
    });
  });

  describe('getTableCdn', () => {
    it('should return CDN data from cache', async () => {
      const spyGetCache = jest.spyOn(service, 'getCache');
      const mockCacheOutput: GetTableCdnOutput = {
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

      const spyRefreshCache = jest.spyOn(service, 'refreshCache').mockResolvedValue(undefined);
      (mockStudioCdnRepository.insertTableCdn as jest.Mock).mockResolvedValue(mockRepoResult);

      const result = await service.insertTableCdn(request);

      expect(mockStudioCdnRepository.insertTableCdn).toHaveBeenCalledWith(
        expect.objectContaining({ tableId: request.tableId }),
      );
      const expectedOutput = { tableId: mockRepoResult.TABLE_ID, cdnDst: mockRepoResult.CDN };
      expect(spyRefreshCache).toHaveBeenCalledWith(expectedOutput);
      expect(result).toEqual(expectedOutput);
    });
  });

  describe('updateTableCdn', () => {
    it('should update an existing CDN entry and refresh cache', async () => {
      const request: UpdateStudioTableCdnRequestType = {
        tableId: 'cdn-update',
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

      const spyRefreshCache = jest.spyOn(service, 'refreshCache').mockResolvedValue(undefined);
      (mockStudioCdnRepository.updateTableCdn as jest.Mock).mockResolvedValue(affectedRows);

      const result = await service.updateTableCdn(request);

      expect(mockStudioCdnRepository.updateTableCdn).toHaveBeenCalledWith(
        expect.objectContaining({ tableId: request.tableId }),
      );
      const expectedOutput = { tableId: request.tableId, cdnDst: request.cdnDst };
      expect(spyRefreshCache).toHaveBeenCalledWith(expectedOutput);
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

      const spyRefreshCache = jest.spyOn(service, 'refreshCache').mockResolvedValue(undefined);
      (mockStudioCdnRepository.updateTableCdn as jest.Mock).mockResolvedValue(affectedRows);

      await expect(service.updateTableCdn(request)).rejects.toThrow(StudioNotFoundError);
      expect(spyRefreshCache).not.toHaveBeenCalled();
    });
  });
});
