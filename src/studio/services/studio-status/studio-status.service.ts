import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import {
  GetTableStatusRequestType,
  InsertTableStatusRequestType,
  UpdateTableStatusRequestType,
  UpdateTableStatusResponseType,
} from 'src/studio/controller/v1/studio-status/studio-status.type';
import { StudioStatus } from 'src/studio/entities/studio-status.entity';
import { StudioNotFoundError } from 'src/studio/errors/studio-not-found.error';
import { StudioStatusRepository } from 'src/studio/repositories/studio-status/studio-status.repository';
import {
  GetTableStatusOutput,
  InsertTableStatusOutput,
} from 'src/studio/services/studio-status/studio-status.service.type';
import { StudioCacheService } from '../studio-cache/studio-cache.service';

export class StudioStatusService implements ModuleLifecycle {
  constructor(
    private readonly studioStatusRepository: StudioStatusRepository,
    private readonly studioCacheService: StudioCacheService,
    private readonly logger: LoggerService,
  ) {}

  async getTableStatusByTableID(tableId: string): Promise<StudioStatus> {
    const entity = await this.studioStatusRepository.getTableStatusByTableID(tableId);

    if (!entity) {
      throw new StudioNotFoundError(`table ${tableId} not found`);
    }
    return entity;
  }

  async getTableStatus(type: GetTableStatusRequestType): Promise<GetTableStatusOutput> {
    const output = await this.studioCacheService.getCache('status', type.tableId);
    if (!output) {
      throw new StudioNotFoundError(`table ${type.tableId} not found`);
    }

    return output as GetTableStatusOutput;
  }

  async insertTableStatus(type: InsertTableStatusRequestType): Promise<InsertTableStatusOutput> {
    const studioReturning = await this.studioStatusRepository.insertTableStatus(type.tableId);
    const output = {
      tableId: studioReturning.TABLE_ID,
      uptime: studioReturning.UPTIME,
      timestamp: studioReturning.TIMESTAMP.getTime(),
      maintenance: studioReturning.MAINTENANCE,
      sdp: studioReturning.SDP,
      idp: studioReturning.IDP,
      broker: studioReturning.BROKER,
      zCam: studioReturning.Z_CAM,
      roulette: studioReturning.ROULETTE,
      shaker: studioReturning.SHAKER,
      barcodeScanner: studioReturning.BARCODE_SCANNER,
      nfcScanner: studioReturning.NFC_SCANNER,
    };

    await this.studioCacheService.refreshCache('status', output);

    return output;
  }

  async updateTableStatus(
    type: UpdateTableStatusRequestType,
  ): Promise<UpdateTableStatusResponseType> {
    const { tableId, ...entity } = type;
    this.logger.info(JSON.stringify(entity));
    const result = await this.studioStatusRepository.updateTableStatus(tableId, entity);
    this.logger.info(`result = ${result}`);
    if (result <= 0) throw new StudioNotFoundError(`tableId ${tableId} hasn't changed`);

    const output = {
      tableId: tableId,
      ...entity,
    };

    await this.studioCacheService.refreshCache('status', output);

    return output;
  }

  async onInit(): Promise<void> {}
}
