import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';

import { StudioErrorSignalLogRepository } from 'src/studio/repositories/studio-log/studio-error-signal-log.repository';
import { DbStudioErrorSignalLog } from 'src/studio/repositories/studio-log/studio-error-signal-log.repository.type';
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

  async getLog(input: GetErrorSignalLogServiceInput): Promise<ErrorSignalLogServiceOutput[]> {
    const result = await this.studioErrorSignalLogRepository.getErrorSignalLogById(
      input.signalId,
      input.limit,
    );
    return result.map((item) => this.convert(item));
  }

  async insertLog(input: InsertErrorSignalLogServiceInput): Promise<ErrorSignalLogServiceOutput> {
    const result = await this.studioErrorSignalLogRepository.insertErrorSignalLog({
      deviceId: input.deviceId,
      msgId: input.errorSignal.msgId,
      content: input.errorSignal.content,
      errorSignal: input.errorSignal.metadata,
    });
    return this.convert(result);
  }

  async resolveErrorSignalLogsByDeviceId(
    deviceId: UpdateErrorSignalLogServiceInput,
  ): Promise<ErrorSignalLogServiceOutput[]> {
    const result =
      await this.studioErrorSignalLogRepository.resolveErrorSignalLogsByDeviceId(deviceId);
    return result.map((item) => this.convert(item));
  }

  async onInit(): Promise<void> {}

  private convert(input: DbStudioErrorSignalLog) {
    return {
      id: input.id,
      deviceId: input.deviceId,
      errorSignal: {
        msgId: input.msgId,
        content: input.content,
        metadata: input.errorSignal,
      },
      resolved: input.resolved,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    };
  }
}
