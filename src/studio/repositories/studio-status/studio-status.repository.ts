/* eslint-disable unicorn/no-null */
import { ModuleLifecycle } from '@ikigaians/mod';
import { DbService } from 'src/db/db.service';
import {
  GetTableStatusQuery,
  TableStatusResult,
} from 'src/studio/services/studio-status/studio-status.service.type';
import { StudioStatus } from '../../entities/studio-status.entity';
import { InsertTableStatusResult, UpdateTableStatusEntity } from './studio-status.repository.type';

export class StudioStatusRepository implements ModuleLifecycle {
  constructor(private readonly dbService: DbService) {}

  async getTableStatusByTableID(tableID: string): Promise<StudioStatus | null> {
    const builder = this.dbService
      .getConnection()
      .getRepository(StudioStatus)
      .createQueryBuilder('studio')
      .where('studio.TABLE_ID = :tableID', { tableID: tableID });

    return await builder.getOne();
  }

  async getTableStatus(query: GetTableStatusQuery) {
    const repository = this.dbService.getConnection();
    const builder = repository
      .createQueryBuilder()
      .select([
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
      ])
      .from(StudioStatus, 'studio')
      .where('studio.TABLE_ID = :tableId', { tableId: query.tableId });

    return await builder.getRawOne<TableStatusResult>();
  }

  async insertTableStatus(tableId: string): Promise<InsertTableStatusResult> {
    const result = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .insert()
      .into(StudioStatus)
      .values({ tableId: tableId })
      .returning([
        'tableId',
        'uptime',
        'timestamp',
        'maintenance',
        'sdp',
        'idp',
        'broker',
        'zCam',
        'roulette',
        'shaker',
        'barcodeScanner',
        'nfcScanner',
      ])
      .execute();
    return result.raw[0] as InsertTableStatusResult;
  }

  async updateTableStatus(tableId: string, entity: UpdateTableStatusEntity): Promise<number> {
    const whereClause = Object.keys(entity)
      .map((key) => `${key} = :${key}`)
      .join(' AND ');

    const updateResult = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .update(StudioStatus)
      .set(entity)
      .where('tableId = :tableId', { tableId })
      .andWhere(`NOT (${whereClause})`)
      .setParameters(entity)
      .execute();

    return updateResult.affected ?? -1;
  }

  async onInit(): Promise<void> {}
}
