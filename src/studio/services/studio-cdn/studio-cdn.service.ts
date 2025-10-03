import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { CacheService } from 'src/cache/cache.service';
import {
  GetStudioTableCdnRequestType,
  InsertStudioTableCdnRequestType,
  UpdateStudioTableCdnRequestType,
} from 'src/studio/controller/v1/studio-cdn/studio-cdn.type';
import { StudioCdn } from 'src/studio/entities/studio-cdn.entity';
import { StudioNotFoundError } from 'src/studio/errors/studio.error';
import { StudioCdnRepository } from 'src/studio/repositories/studio-cdn/studio-cdn.repository';
import {
  TableCdnResult,
  UpdateTableCdnEntity,
} from 'src/studio/repositories/studio-cdn/studio-cdn.repository.type';
import {
  GetStudioCdnServiceOutput,
  InsertStudioCdnServiceOutput,
  schema,
  UpdateStudioCdnServiceOutput,
} from 'src/studio/services/studio-cdn/studio-cdn.service.type';

export class StudioCdnService implements ModuleLifecycle {
  constructor(
    private readonly studioCdnRepository: StudioCdnRepository,
    private readonly cacheService: CacheService,
    private readonly logger: LoggerService,
  ) {}

  async getTableCdn(type: GetStudioTableCdnRequestType): Promise<GetStudioCdnServiceOutput> {
    const output = await this.getCache(type.tableId);
    if (!output) {
      throw new StudioNotFoundError(`table ${type.tableId} not found`);
    }
    return output;
  }

  async insertTableCdn(
    type: InsertStudioTableCdnRequestType,
  ): Promise<InsertStudioCdnServiceOutput> {
    const studio: StudioCdn = new StudioCdn();
    studio.tableId = type.tableId;
    studio.cdnDst = type.cdnDst;

    const output = await this.studioCdnRepository.insertTableCdn(studio);
    await this.refreshCache(output.tableId, output);

    return output;
  }

  async updateTableCdn(
    type: UpdateStudioTableCdnRequestType,
  ): Promise<UpdateStudioCdnServiceOutput> {
    const entity: UpdateTableCdnEntity = {
      tableId: type.tableId,
      cdnDst: type.cdnDst,
    };

    const result = await this.studioCdnRepository.updateTableCdn(entity);
    if (result === undefined)
      throw new StudioNotFoundError(`tableId ${type.tableId} can't be found`);

    await this.refreshCache(result.tableId, result);

    return {
      tableId: type.tableId,
      cdnDst: type.cdnDst,
    };
  }

  private getCacheKey(gameCode: string) {
    return `studio-cdn-${gameCode}`;
  }

  async getCache(key: string): Promise<GetStudioCdnServiceOutput | undefined> {
    const tag = this.getCacheKey(key);
    const cache = await this.cacheService.getHashAs<GetStudioCdnServiceOutput>(tag, schema);
    if (cache === undefined) {
      const output = await this.studioCdnRepository.getTableCdnByTableID(key);
      if (output) await this.cacheService.setHash(tag, output);
      return output;
    }
    return cache;
  }

  private async refreshCache(gameCode: string, data: TableCdnResult) {
    const cacheKey = this.getCacheKey(gameCode);
    await this.cacheService.setHash(cacheKey, data);
  }

  async onInit(): Promise<void> {}
}
