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

      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValue(mockResult);

      const result = await repository.getTableCdn(query);

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);
      expect(mockConnection.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.select).toHaveBeenCalledWith(['studio."CDN" as "cdn"']);
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
      const mockRawResult: UpsertTableCdnResult = {
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
      const mockExecuteResult = { raw: [mockRawResult] };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValue(mockExecuteResult);

      const result = await repository.upsertTableCdn(mockStudio);

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.insert).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.into).toHaveBeenCalledWith(StudioCdn);
      expect(mockQueryBuilder.values).toHaveBeenCalledWith(mockStudio);
      expect(mockQueryBuilder.orUpdate).toHaveBeenCalledWith(['CDN'], ['TABLE_ID']);
      expect(mockQueryBuilder.returning).toHaveBeenCalledWith(['tableId', 'cdnDst']);
      expect(result).toEqual(mockRawResult);
    });
  });
});
