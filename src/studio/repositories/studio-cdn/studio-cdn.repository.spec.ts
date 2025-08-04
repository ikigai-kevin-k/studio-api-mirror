// studio-cdn.repository.spec.ts
/* eslint-disable unicorn/no-null */
import { DbService } from 'src/db/db.service';
import { StudioCdn } from 'src/studio/entities/studio-cdn.entity';
import { StudioCdnRepository } from 'src/studio/repositories/studio-cdn/studio-cdn.repository';
import { UpsertTableCdnResult } from 'src/studio/repositories/studio-cdn/studio-cdn.repository.type';

const mockQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  innerJoin: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  into: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  orUpdate: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  execute: jest.fn(),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  getOne: jest.fn(),
  getRawOne: jest.fn(),
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

describe('StudioCdnRepository', () => {
  let repository: StudioCdnRepository;

  beforeEach(() => {
    repository = new StudioCdnRepository(mockDbService);
    jest.clearAllMocks();
  });

  describe('getTableCdnByTableID', () => {
    it('should return a studioCdn object when found', async () => {
      const mockStudio: StudioCdn = {
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

      (mockQueryBuilder.getOne as jest.Mock).mockResolvedValue(mockStudio);

      const result = await repository.getTableCdnByTableID('uniTest');

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);

      expect(mockConnection.getRepository).toHaveBeenCalledWith(StudioCdn);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('studio');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('studio.TABLE_ID = :tableID', {
        tableID: 'uniTest',
      });
      expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockStudio);
    });

    it('should return null when no studio is found', async () => {
      (mockQueryBuilder.getOne as jest.Mock).mockResolvedValue(null);

      const result = await repository.getTableCdnByTableID('non-existent-table');

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);
      expect(mockConnection.getRepository).toHaveBeenCalledWith(StudioCdn);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1);

      expect(result).toBeNull();
    });
  });

  describe('getTableCdn', () => {
    it('should return an array of TableCdnResult', async () => {
      const query = { tableId: 'uniTest' };
      const mockResult = {
        primaryHd: 'http://ikg-cit.io/hd.flv',
        primaryHi: 'http://ikg-cit.io/hi.flv',
        primaryMe: 'http://ikg-cit.io/me.flv',
        primaryLo: 'http://ikg-cit.io/lo.flv',
        secondaryHd: 'http://ikg-cit.io/hd.flv',
        secondaryHi: 'http://ikg-cit.io/hi.flv',
        secondaryMe: 'http://ikg-cit.io/me.flv',
        secondaryLo: 'http://ikg-cit.io/lo.flv',
      };

      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValue(mockResult);

      const result = await repository.getTableCdn(query);

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);
      expect(mockConnection.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.select).toHaveBeenCalledWith([
        'studio."PRIMARY_HD" as "primaryHd"',
        'studio."PRIMARY_HI" as "primaryHi"',
        'studio."PRIMARY_ME" as "primaryMe"',
        'studio."PRIMARY_LO" as "primaryLo"',
        'studio."SECONDARY_HD" as "secondaryHd"',
        'studio."SECONDARY_HI" as "secondaryHi"',
        'studio."SECONDARY_ME" as "secondaryMe"',
        'studio."SECONDARY_LO" as "secondaryLo"',
      ]);
      expect(mockQueryBuilder.from).toHaveBeenCalledWith(StudioCdn, 'studio');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('studio.TABLE_ID = :tableId', {
        tableId: query.tableId,
      });
      expect(mockQueryBuilder.getRawOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('upsertTableCdn', () => {
    it('should insert or update a studioCdn and return the result', async () => {
      const mockStudio: StudioCdn = {
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
      const mockRawResult: UpsertTableCdnResult = {
        TABLE_ID: 'uniTest',
        PRIMARY_HD: 'http://ikg-cit.io/hd.flv',
        PRIMARY_HI: 'http://ikg-cit.io/hi.flv',
        PRIMARY_ME: 'http://ikg-cit.io/me.flv',
        PRIMARY_LO: 'http://ikg-cit.io/lo.flv',
        SECONDARY_HD: 'http://ikg-cit.io/hd.flv',
        SECONDARY_HI: 'http://ikg-cit.io/hi.flv',
        SECONDARY_ME: 'http://ikg-cit.io/me.flv',
        SECONDARY_LO: 'http://ikg-cit.io/lo.flv',
      };
      const mockExecuteResult = { raw: [mockRawResult] };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValue(mockExecuteResult);

      const result = await repository.upsertTableCdn(mockStudio);

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.insert).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.into).toHaveBeenCalledWith(StudioCdn);
      expect(mockQueryBuilder.values).toHaveBeenCalledWith(mockStudio);
      expect(mockQueryBuilder.orUpdate).toHaveBeenCalledWith(
        [
          'PRIMARY_HD',
          'PRIMARY_HI',
          'PRIMARY_ME',
          'PRIMARY_LO',
          'SECONDARY_HD',
          'SECONDARY_HI',
          'SECONDARY_ME',
          'SECONDARY_LO',
        ],
        ['TABLE_ID'],
      );
      expect(mockQueryBuilder.returning).toHaveBeenCalledWith([
        'tableId',
        'primaryHd',
        'primaryHi',
        'primaryMe',
        'primaryLo',
        'secondaryHd',
        'secondaryHi',
        'secondaryMe',
        'secondaryLo',
      ]);
      expect(result).toEqual(mockRawResult);
    });
  });
});
