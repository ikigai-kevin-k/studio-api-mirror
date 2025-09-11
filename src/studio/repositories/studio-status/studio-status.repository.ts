import { ModuleLifecycle } from '@ikigaians/mod';
import { DbService } from 'src/db/db.service';
import { StudioStatus } from '../../entities/studio-status.entity';
import {
  GetTableStatusResult,
  InsertTableStatusResult,
  UpdateTableStatusEntity,
} from './studio-status.repository.type';

export class StudioStatusRepository implements ModuleLifecycle {
  constructor(private readonly dbService: DbService) {}

  async getTableStatusByTableID(tableID: string): Promise<GetTableStatusResult | undefined> {
    const builder = this.dbService
      .getConnection()
      .createQueryBuilder(StudioStatus, 'studio')
      .where('studio.TABLE_ID = :tableID', { tableID: tableID })
      .select([
        'studio."TABLE_ID" as "tableId"',
        'studio."UPTIME" as "uptime"',
        '(EXTRACT(EPOCH FROM studio."TIMESTAMP") * 1000)::bigint as "timestamp"',
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

    return await builder.getRawOne<GetTableStatusResult>();
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
