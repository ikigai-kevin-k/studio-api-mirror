/* eslint-disable unicorn/no-null */
import { ModuleLifecycle } from '@ikigaians/mod';
import { DbService } from 'src/db/db.service';
import { StudioCdn } from 'src/studio/entities/studio-cdn.entity';
import { StudioStatus } from 'src/studio/entities/studio-status.entity';
import { StudioCacheData } from 'src/studio/services/studio-cache/studio-cache.service.type';
import { Studio } from '../../entities/studio.entity';

export class StudioCacheRepository implements ModuleLifecycle {
  constructor(private readonly dbService: DbService) {}

  async getStudioCache(): Promise<StudioCacheData[]> {
    const builder = this.dbService
      .getConnection()
      .createQueryBuilder(Studio, 'studio')
      .select(['studio."TABLE_ID" as "tableId"', 'studio."TABLE_STATUS" as "tableStatus"']);

    return await builder.getRawMany<StudioCacheData>();
  }

  async getStudioCdnCache(): Promise<StudioCacheData[]> {
    const builder = this.dbService
      .getConnection()
      .createQueryBuilder(StudioCdn, 'studio')
      .select(['studio."TABLE_ID" as "tableId"', 'studio."CDN" as "cdnDst"']);

    return await builder.getRawMany<StudioCacheData>();
  }

  async getStudioStatusCache(): Promise<StudioCacheData[]> {
    const builder = this.dbService
      .getConnection()
      .createQueryBuilder(StudioStatus, 'studio')
      .select([
        'studio."TABLE_ID" as "tableId"',
        'studio."UPTIME" as "uptime"',
        'studio."TIMESTAMP" as "timestamp"',
        'studio."MAINTENANCE" as "maintenance"',
        'studio."SDP" as "sdp"',
        'studio."IDP" as "idp"',
        'studio."BROKER" as "broker"',
        'studio."Z_CAM" as "zCam"',
        'studio."ROULETTE" as "roulette"',
        'studio."SHAKER" as "shaker"',
        'studio."BARCODE_SCANNER" as "barcodeScanner"',
        'studio."NFC_SCANNER" as "nfcScanner"',
      ]);

    return await builder.getRawMany<StudioCacheData>();
  }

  async onInit(): Promise<void> {}
}
