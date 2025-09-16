import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { CacheService } from 'src/cache/cache.service';
import {
  GetTableStatusRequestType,
  InsertTableStatusRequestType,
  UpdateTableStatusRequestType,
  UpdateTableStatusResponseType,
} from 'src/studio/controller/v1/studio-status/studio-status.type';
import { StudioNotFoundError } from 'src/studio/errors/studio-not-found.error';
import { StudioStatusRepository } from 'src/studio/repositories/studio-status/studio-status.repository';
import {
  schema,
  StudioStatusServiceOutput,
  UpdateStudioStatusServiceInput,
} from 'src/studio/services/studio-status/studio-status.service.type';

export class StudioStatusService implements ModuleLifecycle {
  constructor(
    private readonly studioStatusRepository: StudioStatusRepository,
    private readonly cacheService: CacheService,
    private readonly logger: LoggerService,
  ) {}

  async getTableStatus(type: GetTableStatusRequestType): Promise<StudioStatusServiceOutput> {
    const output = await this.getCache(type.tableId);
    if (!output) {
      throw new StudioNotFoundError(`table ${type.tableId} not found`);
    }

    return output as StudioStatusServiceOutput;
  }

  async insertTableStatus(type: InsertTableStatusRequestType): Promise<StudioStatusServiceOutput> {
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

    await this.refreshCache(output.tableId, output);

    return output;
  }

  async updateTableStatus(
    type: UpdateTableStatusRequestType,
  ): Promise<UpdateTableStatusResponseType> {
    const { tableId, timestamp, ...params } = type;
    const entity = {
      ...params,
      timestamp: timestamp ? new Date(timestamp) : undefined,
    };
    const result = await this.studioStatusRepository.updateTableStatus(tableId, entity);
    if (result <= 0) throw new StudioNotFoundError(`gameCode ${tableId} hasn't changed`);

    const output = {
      tableId: tableId,
      timestamp,
      ...params,
    };

    await this.refreshCache(output.tableId, output);

    return output;
  }

  async updateTableStatusByWebSocket(
    tableId: string,
    input: UpdateStudioStatusServiceInput,
  ): Promise<StudioStatusServiceOutput> {
    this.logger.info(JSON.stringify(input));
    await this.studioStatusRepository.updateTableStatus(tableId, input);

    const output = {
      tableId: tableId,
      ...input,
      timestamp: input.timestamp ? input.timestamp.getTime() : undefined,
    };

    await this.refreshCache(output.tableId, output);

    return output;
  }

  private getCacheKey(gameCode: string) {
    return `studio-status-${gameCode}`;
  }

  async getCache(key: string): Promise<StudioStatusServiceOutput | undefined> {
    const tag = this.getCacheKey(key);
    const cache = await this.cacheService.getHashAs<StudioStatusServiceOutput>(tag, schema);
    if (cache === undefined) {
      const output = await this.studioStatusRepository.getTableStatusByTableID(key);
      if (output) await this.cacheService.setHash(tag, output);
      return output;
    }
    return cache;
  }

  private async refreshCache(gameCode: string, data: object) {
    const cache = await this.getCache(gameCode);
    await this.cacheService.setHash(this.getCacheKey(gameCode), { ...cache, ...data });
  }

  async onInit(): Promise<void> {}

  async onDispose(): Promise<void> {}
}
