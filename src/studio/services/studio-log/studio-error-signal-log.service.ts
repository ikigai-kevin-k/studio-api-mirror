import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';

import { StudioErrorSignalLogRepository } from 'src/studio/repositories/studio-log/studio-error-signal-log.repository';
import {
  ErrorSignalLogServiceOutput,
  GetErrorSignalLogServiceInput,
  GetUnResolvedErrorSignalLogServiceInput,
  InsertErrorSignalLogServiceInput,
  UpdateErrorSignalLogServiceInput,
} from './studio-error-signal-log.service.type';

export class StudioErrorSignalLogService implements ModuleLifecycle {
  constructor(
    private readonly studioErrorSignalLogRepository: StudioErrorSignalLogRepository,
    private readonly logger: LoggerService,
  ) {}

  async getLog(input: GetErrorSignalLogServiceInput): Promise<ErrorSignalLogServiceOutput> {
    return await this.studioErrorSignalLogRepository.getErrorSignalLogById(input.signalId);
  }

  async insertLog(input: InsertErrorSignalLogServiceInput): Promise<ErrorSignalLogServiceOutput> {
    return await this.studioErrorSignalLogRepository.insertErrorSignalLog(
      input.deviceId,
      input.errorSignal,
    );
  }

  async updateLog(type: UpdateErrorSignalLogServiceInput): Promise<ErrorSignalLogServiceOutput> {
    return await this.studioErrorSignalLogRepository.updateErrorSignalLog(type);
  }

  async getUnResolvedLog(
    input: GetUnResolvedErrorSignalLogServiceInput,
  ): Promise<ErrorSignalLogServiceOutput> {
    return await this.studioErrorSignalLogRepository.getUnResolvedErrorSignalLogByDeviceId(
      input.deviceId,
    );
  }

  async isUnResolvedLogExist(deviceId: string): Promise<boolean> {
    return await this.studioErrorSignalLogRepository.IsUnResolved(deviceId);
  }

  async onInit(): Promise<void> {}
}
