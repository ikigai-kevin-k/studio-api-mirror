// studio-cache.repository.spec.ts
/* eslint-disable unicorn/no-null */
import { DbService } from 'src/db/db.service';
import { StudioCdn } from 'src/studio/entities/studio-cdn.entity';
import { Studio } from 'src/studio/entities/studio.entity';
import { StudioTableStatusEnum } from 'src/studio/enums/studio.enums';
import { StudioCacheRepository } from 'src/studio/repositories/studio-cache/studio-cache.repository';

const mockQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  getRawMany: jest.fn(),
};

const mockConnection = {
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
};

const mockDbService = {
  getConnection: jest.fn(() => mockConnection),
} as unknown as DbService;

describe('StudioCacheRepository', () => {
  let repository: StudioCacheRepository;

  beforeEach(() => {
    repository = new StudioCacheRepository(mockDbService);
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(repository.onInit()).resolves.toBeUndefined();
    });
  });

  describe('getStudioCache', () => {
    it('should return an array of StudioCacheData from Studio entity', async () => {
      const mockResults = [{ tableId: 'uniTest', tableStatus: StudioTableStatusEnum.INACTIVE }];
      (mockQueryBuilder.getRawMany as jest.Mock).mockResolvedValue(mockResults);

      const result = await repository.getStudioCache();

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);
      expect(mockConnection.createQueryBuilder).toHaveBeenCalledWith(Studio, 'studio');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith([
        'studio."TABLE_ID" as "tableId"',
        'studio."TABLE_STATUS" as "tableStatus"',
      ]);
      expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResults);
    });

    it('should return an empty array if no results are found', async () => {
      (mockQueryBuilder.getRawMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.getStudioCache();

      expect(result).toEqual([]);
    });
  });

  describe('getStudioCdnCache', () => {
    it('should return an array of StudioCacheData with cdnDst from StudioCdn entity', async () => {
      const mockResults = [
        {
          tableId: 'cdn-1',
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
        },
      ];
      (mockQueryBuilder.getRawMany as jest.Mock).mockResolvedValue(mockResults);

      const result = await repository.getStudioCdnCache();

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);
      expect(mockConnection.createQueryBuilder).toHaveBeenCalledWith(StudioCdn, 'studio');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith([
        'studio."TABLE_ID" as "tableId"',
        'studio."CDN" as "cdnDst"',
      ]);
      expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResults);
    });

    it('should return an empty array if no results are found', async () => {
      (mockQueryBuilder.getRawMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.getStudioCdnCache();

      expect(result).toEqual([]);
    });
  });
});
