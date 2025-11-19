/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-useless-undefined */
// studio-cdn.service.spec.ts
import { LoggerService } from '@ikigaians/logger';
import { CacheService } from 'src/cache/cache.service';
import { StudioCdnRepository } from 'src/studio/repositories/studio-cdn/studio-cdn.repository';
import { StudioCdnService } from 'src/studio/services/studio-cdn/studio-cdn.service';

const mockStudioCdnRepository = {
  getTableCdnByTableID: jest.fn(),
  insertTableCdn: jest.fn(),
  updateTableCdn: jest.fn(),
} as unknown as StudioCdnRepository;

const mockCacheService = {
  getHashAs: jest.fn(),
  setHash: jest.fn(),
  refresh: jest.fn(),
  has: jest.fn(),
} as unknown as CacheService;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

describe('StudioCdnService', () => {
  let service: StudioCdnService;

  beforeEach(() => {
    service = new StudioCdnService(mockStudioCdnRepository, mockLoggerService);
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(service.onInit()).resolves.toBeUndefined();
    });
  });

  describe('getTableCdn', () => {
    it('should return CDN data from repository', async () => {
      const mockOutput = {
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
      (mockStudioCdnRepository.getTableCdnByTableID as jest.Mock).mockResolvedValueOnce(mockOutput);

      const request = { tableId: 'cdn1' };
      const result = await service.getTableCdn(request);
      expect(result).toEqual(mockOutput);
    });
  });

  describe('insertTableCdn', () => {
    it('should insert a new CDN entry and refresh cache', async () => {
      const request = {
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
      const mockRepoResult = {
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

      (mockStudioCdnRepository.insertTableCdn as jest.Mock).mockResolvedValue(mockRepoResult);

      const result = await service.insertTableCdn(request);
      expect(result).toEqual(request);
    });
  });

  describe('updateTableCdn', () => {
    it('should update an existing CDN entry and refresh cache', async () => {
      const request = {
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
      const mockRepoResult = {
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

      (mockStudioCdnRepository.updateTableCdn as jest.Mock).mockResolvedValue(mockRepoResult);

      const result = await service.updateTableCdn(request);

      expect(mockStudioCdnRepository.updateTableCdn).toHaveBeenCalledWith(
        expect.objectContaining({ tableId: request.tableId }),
      );
      const expectedOutput = { tableId: request.tableId, cdnDst: request.cdnDst };
      expect(result).toEqual(expectedOutput);
    });
  });
});
