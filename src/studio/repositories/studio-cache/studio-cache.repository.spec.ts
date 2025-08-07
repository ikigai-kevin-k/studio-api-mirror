// studio.repository.spec.ts
/* eslint-disable unicorn/no-null */
import { DbService } from 'src/db/db.service';
import { Studio } from 'src/studio/entities/studio.entity';
import { StudioTableStatusEnum } from 'src/studio/enums/studio.enums';
import { StudioCacheRepository } from 'src/studio/repositories/studio-cache/studio-cache.repository';
import { StudioCacheResult } from 'src/studio/services/studio-cache/studio-cache.service.type';

const mockQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  into: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  orUpdate: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  execute: jest.fn(),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
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

describe('StudioCacheRepository', () => {
  let repository: StudioCacheRepository;

  beforeEach(() => {
    repository = new StudioCacheRepository(mockDbService);
    jest.clearAllMocks();
  });

  describe('ModuleLifecycle', () => {
    it('onInit', async () => {
      await repository.onInit();
    });
  });

  describe('getCacheByTableID', () => {
    it('should return a StudioCacheResult object when found', async () => {
      const mockStudio: StudioCacheResult = {
        tableId: 'uniTest',
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

      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValue(mockStudio);

      const result = await repository.getCacheByTableID('uniTest');

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);

      expect(mockConnection.getRepository).toHaveBeenCalledWith(Studio);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('studio');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'studio-cdn',
        'sc',
        'sc.TABLE_ID = studio.TABLE_ID',
      );
      expect(mockQueryBuilder.select).toHaveBeenCalledWith([
        'studio."TABLE_ID" as "tableId"',
        'studio."TABLE_STATUS" as "tableStatus"',
        `COALESCE(sc."CDN", '{"primary": { "hd":"", "hi":"", "me":"", "lo":"" }, "secondary": { "hd":"", "hi":"", "me":"", "lo":"" }}') as "cdnDst"`,
      ]);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('studio.TABLE_ID = :tableID', {
        tableID: 'uniTest',
      });
      expect(mockQueryBuilder.getRawOne).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockStudio);
    });

    it('should return null when no studio is found', async () => {
      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValue(null);

      const result = await repository.getCacheByTableID('non-existent-table');

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);
      expect(mockConnection.getRepository).toHaveBeenCalledWith(Studio);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('studio');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'studio-cdn',
        'sc',
        'sc.TABLE_ID = studio.TABLE_ID',
      );
      expect(mockQueryBuilder.select).toHaveBeenCalledWith([
        'studio."TABLE_ID" as "tableId"',
        'studio."TABLE_STATUS" as "tableStatus"',
        `COALESCE(sc."CDN", '{"primary": { "hd":"", "hi":"", "me":"", "lo":"" }, "secondary": { "hd":"", "hi":"", "me":"", "lo":"" }}') as "cdnDst"`,
      ]);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('studio.TABLE_ID = :tableID', {
        tableID: 'non-existent-table',
      });
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.getRawOne).toHaveBeenCalledTimes(1);

      expect(result).toBeNull();
    });
  });

  describe('getCaches', () => {
    it('should return an array of StudioCacheResult', async () => {
      const mockResult = [
        {
          tableId: 'uniTest',
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
        },
      ];

      (mockQueryBuilder.getRawMany as jest.Mock).mockResolvedValue(mockResult);

      const result = await repository.getCaches();

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'studio-cdn',
        'sc',
        'sc.TABLE_ID = studio.TABLE_ID',
      );
      expect(mockQueryBuilder.select).toHaveBeenCalledWith([
        'studio."TABLE_ID" as "tableId"',
        'studio."TABLE_STATUS" as "tableStatus"',
        `COALESCE(sc."CDN", '{"primary": { "hd":"", "hi":"", "me":"", "lo":"" }, "secondary": { "hd":"", "hi":"", "me":"", "lo":"" }}') as "cdnDst"`,
      ]);
      expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });
  });
});
