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

    await this.refreshCache(output);

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
    this.logger.info(`result = ${result}`);
    if (result <= 0) throw new StudioNotFoundError(`tableId ${tableId} hasn't changed`);

    const output = {
      tableId: tableId,
      ...entity,
      timestamp: entity.timestamp ? entity.timestamp.getTime() : undefined,
    };

    await this.refreshCache(output);

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

    await this.refreshCache(output);

    return output;
  }

  async getCache(key: string): Promise<StudioStatusServiceOutput | undefined> {
    const tag = `studio-status-${key}`;
    const raw = await this.cacheService.get(tag);

    if (!raw) {
      const output = await this.studioStatusRepository.getTableStatusByTableID(key);
      if (output) await this.cacheService.set(tag, JSON.stringify(output), 86_400);
      return output;
    }

    return JSON.parse(raw) as StudioStatusServiceOutput;
  }

  async refreshCache(cache: StudioStatusServiceOutput): Promise<void> {
    const origin = await this.getCache(cache.tableId);

    const result = {
      ...origin,
      ...Object.fromEntries(
        Object.entries(cache).filter(([_key, v]) => _key !== undefined && v !== undefined),
      ),
    } as StudioStatusServiceOutput;

    return await this.cacheService.set(
      `studio-status-${cache.tableId}`,
      JSON.stringify(result),
      86_400,
    );
  }

  async onInit(): Promise<void> {}

  async onDispose(): Promise<void> {}
}
