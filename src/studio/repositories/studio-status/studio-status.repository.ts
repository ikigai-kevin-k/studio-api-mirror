import { ModuleLifecycle } from '@ikigaians/mod';
import { DbService } from 'src/db/db.service';
import { StudioStatus } from '../../entities/studio-status.entity';
import {
  TableStatusResult,
  TableStatusSchema,
  UpdateTableStatusEntity,
} from './studio-status.repository.type';

export class StudioStatusRepository implements ModuleLifecycle {
  constructor(private readonly dbService: DbService) {}

  async getTableStatusByTableID(tableID: string): Promise<TableStatusResult | undefined> {
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

    return await builder.getRawOne<TableStatusResult>();
  }

  async insertTableStatus(tableId: string): Promise<TableStatusResult> {
    const result = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .insert()
      .into(StudioStatus)
      .values({ tableId: tableId })
      .returning('*')
      .execute();

    const data = result.raw[0] as TableStatusSchema;
    return {
      tableId: data.TABLE_ID,
      uptime: data.UPTIME,
      timestamp: data.TIMESTAMP.getTime(),
      maintenance: data.MAINTENANCE,
      sdp: data.SDP,
      idp: data.IDP,
      broker: data.BROKER,
      zCam: data.Z_CAM,
      roulette: data.ROULETTE,
      shaker: data.SHAKER,
      barcodeScanner: data.BARCODE_SCANNER,
      nfcScanner: data.NFC_SCANNER,
    };
  }

  async updateTableStatus(
    tableId: string,
    entity: UpdateTableStatusEntity,
  ): Promise<TableStatusResult | undefined> {
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
      .returning('*')
      .execute();

    if (updateResult.affected === 0) return undefined;

    const data = updateResult.raw[0] as TableStatusSchema;
    return {
      tableId: data.TABLE_ID,
      uptime: data.UPTIME,
      timestamp: data.TIMESTAMP.getTime(),
      maintenance: data.MAINTENANCE,
      sdp: data.SDP,
      idp: data.IDP,
      broker: data.BROKER,
      zCam: data.Z_CAM,
      roulette: data.ROULETTE,
      shaker: data.SHAKER,
      barcodeScanner: data.BARCODE_SCANNER,
      nfcScanner: data.NFC_SCANNER,
    };
  }

  async onInit(): Promise<void> {}
}
