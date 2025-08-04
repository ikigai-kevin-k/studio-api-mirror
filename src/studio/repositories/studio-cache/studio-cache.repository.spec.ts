// studio.repository.spec.ts
/* eslint-disable unicorn/no-null */
import { DbService } from 'src/db/db.service';
import { Studio } from 'src/studio/entities/studio.entity';
import { StudioTableStatusType } from 'src/studio/enums/studio.enums';
import { StudioCacheResult } from 'src/studio/model/studio-cache/studio-cache.model';
import { StudioCacheRepository } from 'src/studio/repositories/studio-cache/studio-cache.repository';

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

  describe('getCacheByTableID', () => {
    it('should return a StudioCacheResult object when found', async () => {
      const mockStudio: StudioCacheResult = {
        tableId: 'uniTest',
        tableStatus: StudioTableStatusType.INACTIVE,
        primaryHd: 'http://ikg-cit.io/hd.flv',
        primaryHi: 'http://ikg-cit.io/hi.flv',
        primaryMe: 'http://ikg-cit.io/me.flv',
        primaryLo: 'http://ikg-cit.io/lo.flv',
        secondaryHd: 'http://ikg-cit.io/hd.flv',
        secondaryHi: 'http://ikg-cit.io/hi.flv',
        secondaryMe: 'http://ikg-cit.io/me.flv',
        secondaryLo: 'http://ikg-cit.io/lo.flv',
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
        'sc."PRIMARY_HD" as "primaryHd"',
        'sc."PRIMARY_HI" as "primaryHi"',
        'sc."PRIMARY_ME" as "primaryMe"',
        'sc."PRIMARY_LO" as "primaryLo"',
        'sc."SECONDARY_HD" as "secondaryHd"',
        'sc."SECONDARY_HI" as "secondaryHi"',
        'sc."SECONDARY_ME" as "secondaryMe"',
        'sc."SECONDARY_LO" as "secondaryLo"',
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
        'sc."PRIMARY_HD" as "primaryHd"',
        'sc."PRIMARY_HI" as "primaryHi"',
        'sc."PRIMARY_ME" as "primaryMe"',
        'sc."PRIMARY_LO" as "primaryLo"',
        'sc."SECONDARY_HD" as "secondaryHd"',
        'sc."SECONDARY_HI" as "secondaryHi"',
        'sc."SECONDARY_ME" as "secondaryMe"',
        'sc."SECONDARY_LO" as "secondaryLo"',
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
          tableStatus: StudioTableStatusType.INACTIVE,
          primaryHd: 'http://ikg-cit.io/hd.flv',
          primaryHi: 'http://ikg-cit.io/hi.flv',
          primaryMe: 'http://ikg-cit.io/me.flv',
          primaryLo: 'http://ikg-cit.io/lo.flv',
          secondaryHd: 'http://ikg-cit.io/hd.flv',
          secondaryHi: 'http://ikg-cit.io/hi.flv',
          secondaryMe: 'http://ikg-cit.io/me.flv',
          secondaryLo: 'http://ikg-cit.io/lo.flv',
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
        'sc."PRIMARY_HD" as "primaryHd"',
        'sc."PRIMARY_HI" as "primaryHi"',
        'sc."PRIMARY_ME" as "primaryMe"',
        'sc."PRIMARY_LO" as "primaryLo"',
        'sc."SECONDARY_HD" as "secondaryHd"',
        'sc."SECONDARY_HI" as "secondaryHi"',
        'sc."SECONDARY_ME" as "secondaryMe"',
        'sc."SECONDARY_LO" as "secondaryLo"',
      ]);
      expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });
  });
});
