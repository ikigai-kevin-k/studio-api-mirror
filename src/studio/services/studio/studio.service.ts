import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { StudioApiError } from 'src/global/errors/error';
import {
  GetStudioServiceInput,
  GetStudioServiceOutput,
  InsertStudioServiceInput,
  InsertStudioServiceOutput,
  StudioServiceOutput,
  UpdateStudioServiceInput,
  UpdateStudioServiceStatusOutput,
} from 'src/studio/services/studio/studio.service.type';
import { StudioRepository } from '../../repositories/studio/studio.repository';

export class StudioService implements ModuleLifecycle {
  constructor(
    private readonly studioRepository: StudioRepository,
    private readonly logger: LoggerService,
  ) {}

  async getStudioTable(input: GetStudioServiceInput): Promise<GetStudioServiceOutput> {
    const studioReturning: StudioServiceOutput[] = [];

    for (const tableId of input.tableId ?? []) {
      try {
        const data = await this.studioRepository.getStudioTableByTableID(tableId);
        studioReturning.push(data);
      } catch (error) {
        const { code, message } = error as StudioApiError;
        const msg = `query table studio failure, code: ${code}, reason: ${message}`;
        this.logger.error(msg);
      }
    }

    return {
      list: studioReturning,
    };
  }

  async insertStudioTable(input: InsertStudioServiceInput): Promise<InsertStudioServiceOutput> {
    return await this.studioRepository.insertStudioTable(input.tableId);
  }

  async updateStudioTable(
    input: UpdateStudioServiceInput,
  ): Promise<UpdateStudioServiceStatusOutput> {
    return await this.studioRepository.updateStudioTable(input);
  }

  async getStudioTableBelongTo(tableId: string) {
    const cache = await this.studioRepository.getStudioTableByTableID(tableId);
    return cache.gameId;
  }

  async onInit(): Promise<void> {}
}
