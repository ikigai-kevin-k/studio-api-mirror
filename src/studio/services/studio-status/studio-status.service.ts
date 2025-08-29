import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { CacheService } from 'src/cache/cache.service';
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
  TableStatusOutput,
  UpdateTableStatusInput,
} from 'src/studio/services/studio-status/studio-status.service.type';
import { WsService } from 'src/ws/ws.service';
import { Unsubscribe } from 'src/ws/ws.service.type';
import { WebSocket } from 'ws';

export class StudioStatusService implements ModuleLifecycle {
  private unSubscribes: Unsubscribe[] = [];
  constructor(
    private readonly wsService: WsService,
    private readonly studioStatusRepository: StudioStatusRepository,
    private readonly cacheService: CacheService,
    private readonly logger: LoggerService,
  ) {}

  async getTableStatusByTableID(tableId: string): Promise<StudioStatus> {
    const entity = await this.studioStatusRepository.getTableStatusByTableID(tableId);

    if (!entity) {
      throw new StudioNotFoundError(`table ${tableId} not found`);
    }
    return entity;
  }

  async getTableStatus(type: GetTableStatusRequestType): Promise<TableStatusOutput> {
    const output = await this.getCache(type.tableId);
    if (!output) {
      throw new StudioNotFoundError(`table ${type.tableId} not found`);
    }

    return output as TableStatusOutput;
  }

  async insertTableStatus(type: InsertTableStatusRequestType): Promise<TableStatusOutput> {
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
      // eslint-disable-next-line unicorn/no-negated-condition
      timestamp: timestamp != undefined ? new Date(timestamp) : undefined,
    };
    const result = await this.studioStatusRepository.updateTableStatus(tableId, entity);
    this.logger.info(`result = ${result}`);
    if (result <= 0) throw new StudioNotFoundError(`tableId ${tableId} hasn't changed`);

    const output = {
      tableId: tableId,
      //eslint-disable-next-line unicorn/no-useless-spread
      ...{
        ...entity,
        //eslint-disable-next-line unicorn/no-negated-condition
        timestamp: entity.timestamp != undefined ? entity.timestamp.getTime() : undefined,
      },
    };

    await this.refreshCache(output);

    return output;
  }

  async updateTableStatusByWebSocket(
    tableId: string,
    input: UpdateTableStatusInput,
  ): Promise<TableStatusOutput> {
    this.logger.info(JSON.stringify(input));
    await this.studioStatusRepository.updateTableStatus(tableId, input);

    const output = {
      tableId: tableId,
      //eslint-disable-next-line unicorn/no-useless-spread
      ...{
        ...input,
        //eslint-disable-next-line unicorn/no-negated-condition
        timestamp: input.timestamp != undefined ? input.timestamp.getTime() : undefined,
      },
    };

    await this.refreshCache(output);

    return output;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async onServiceStatus(query: URLSearchParams, ws: WebSocket, data?: any) {
    try {
      const tableId = query.get('id');
      if (!tableId) throw new Error(`Ws connect without tableId !!`);

      const result = await this.updateTableStatusByWebSocket(tableId, data);
      ws.send(JSON.stringify(result));
    } catch (error) {
      const reason = (error as Error).toString();
      this.logger.error(reason);
    }
  }

  async getCaches(): Promise<Map<string, TableStatusOutput>> {
    const tag = 'status';
    const hashTable = await this.cacheService.get(tag);

    if (!hashTable) {
      const caches = await this.studioStatusRepository.getStudioStatusCache();

      const cacheMap = new Map();
      for (const cache of caches) {
        cacheMap.set(cache.tableId, cache);
      }

      await this.cacheService.set(tag, JSON.stringify([...cacheMap]), 86_400);

      return cacheMap;
    }

    return new Map(JSON.parse(hashTable));
  }

  async getCache(key: string): Promise<TableStatusOutput | undefined> {
    const hashTable = await this.getCaches();
    return hashTable.get(key);
  }

  async refreshCache(cache: TableStatusOutput): Promise<void> {
    const hashTable = await this.getCaches();

    const origin = hashTable.get(cache.tableId);

    const result = {
      ...origin,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ...Object.fromEntries(Object.entries(cache).filter(([_, v]) => v !== undefined)),
    } as TableStatusOutput;

    hashTable.set(cache.tableId, result);

    return await this.cacheService.set('status', JSON.stringify([...hashTable]), 86_400);
  }

  async onInit(): Promise<void> {
    this.unSubscribes = [
      this.wsService.subscribe('service_status', this.onServiceStatus.bind(this)),
      // Provide a provisional handling for the legacy format
      // this should be removed after the source updates the packet format.
      this.wsService.subscribe('unknown', this.onServiceStatus.bind(this)),
    ];
  }

  async onDispose(): Promise<void> {
    for (const unSubscribe of this.unSubscribes) {
      unSubscribe();
    }
  }
}
