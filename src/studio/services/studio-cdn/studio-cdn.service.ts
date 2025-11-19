import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { StudioCdnRepository } from 'src/studio/repositories/studio-cdn/studio-cdn.repository';
import {
  GetStudioCdnServiceInput,
  InsertStudioCdnServiceInput,
  StudioCdnServiceOutput,
  UpdateStudioCdnServiceInput,
} from './studio-cdn.service.type';

export class StudioCdnService implements ModuleLifecycle {
  constructor(
    private readonly studioCdnRepository: StudioCdnRepository,
    private readonly logger: LoggerService,
  ) {}

  async getTableCdn(type: GetStudioCdnServiceInput): Promise<StudioCdnServiceOutput> {
    return await this.studioCdnRepository.getTableCdnByTableID(type.tableId);
  }

  async insertTableCdn(type: InsertStudioCdnServiceInput): Promise<StudioCdnServiceOutput> {
    return await this.studioCdnRepository.insertTableCdn(type);
  }

  async updateTableCdn(type: UpdateStudioCdnServiceInput): Promise<StudioCdnServiceOutput> {
    return await this.studioCdnRepository.updateTableCdn(type);
  }

  async onInit(): Promise<void> {}
}
