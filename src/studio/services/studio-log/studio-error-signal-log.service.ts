import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';

import { StudioErrorSignalLogRepository } from 'src/studio/repositories/studio-log/studio-error-signal-log.repository';
import {
  ErrorSignalLogServiceOutput,
  GetErrorSignalLogServiceInput,
  InsertErrorSignalLogServiceInput,
  UpdateErrorSignalLogServiceInput,
} from './studio-error-signal-log.service.type';

export class StudioErrorSignalLogService implements ModuleLifecycle {
  constructor(
    private readonly studioErrorSignalLogRepository: StudioErrorSignalLogRepository,
    private readonly logger: LoggerService,
  ) {}

  async getLog(input: GetErrorSignalLogServiceInput): Promise<ErrorSignalLogServiceOutput> {
    return await this.studioErrorSignalLogRepository.getErrorSignalLogById(input);
  }

  async insertLog(input: InsertErrorSignalLogServiceInput): Promise<ErrorSignalLogServiceOutput> {
    return await this.studioErrorSignalLogRepository.insertErrorSignalLog(input);
  }

  async updateLog(type: UpdateErrorSignalLogServiceInput): Promise<ErrorSignalLogServiceOutput> {
    return await this.studioErrorSignalLogRepository.updateErrorSignalLog(type);
  }

  async onInit(): Promise<void> {}
}
