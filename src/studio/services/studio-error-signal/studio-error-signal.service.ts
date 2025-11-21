import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { KafkaLosSignalService } from 'src/kafka/services/kafka-los-signal/kafka-los-signal.service';
import { StudioDeviceDataService } from 'src/studio/services/studio-device/studio-device-data.service';
import { StudioService } from 'src/studio/services/studio/studio.service';

import { StudioApiError } from 'src/global/errors/error';
import { StudioNotFoundError } from 'src/studio/errors/studio.error';
import { StudioErrorSignalLogService } from 'src/studio/services/studio-log/studio-error-signal-log.service';
import { TableApiQueryService } from 'src/table-api/services/table-api-query/table-api-query.service';
import { TableApiSignalService } from 'src/table-api/services/table-api-signal/table-api-signal.service';
import { StudioErrorSignalServiceInput } from './studio-error-signal.service.type';

export class StudioErrorSignalService implements ModuleLifecycle {
  constructor(
    private readonly tableApiQueryService: TableApiQueryService,
    private readonly studioDeviceDataService: StudioDeviceDataService,
    private readonly studioService: StudioService,
    private readonly studioErrorSignalLogService: StudioErrorSignalLogService,
    private readonly kafkaLosSignalService: KafkaLosSignalService,
    private readonly tableApiSignalService: TableApiSignalService,
    private readonly logger: LoggerService,
  ) {}

  async onInit(): Promise<void> {}

  async forwardErrorSignal(deviceId: string, signal: StudioErrorSignalServiceInput) {
    const { gameId, tableId, tableName } = await this.queryDeviceBelong(deviceId);
    const output = {
      ...signal,
      metadata: { ...signal.metadata },
    };
    output.metadata.gameCode = gameId;
    output.metadata.tableName = tableName;
    output.metadata.tableCode = tableId;

    const log = await this.insertSignalLog(deviceId, output);
    output.metadata.signalId = log.id;
    output.metadata.timestamp = log.createdAt.getTime();

    await Promise.all([this.kafkaLosSignalService.publishError(output)]);

    return output;
  }

  async forwardResolveSignal(deviceId: string) {
    const { gameId, tableId } = await this.queryDeviceBelong(deviceId);
    const result = await this.resolveErrorSignal(deviceId);

    if (result.length > 0) {
      const timestamp = Date.now();
      await this.kafkaLosSignalService.publishResolve({
        signalIds: result.map((item) => item.id),
        gameCode: gameId,
        tableCode: tableId,
        timestamp,
      });
    }

    return result;
  }

  private async insertSignalLog(deviceId: string, data: StudioErrorSignalServiceInput) {
    return await this.studioErrorSignalLogService.insertLog({
      deviceId: deviceId,
      errorSignal: data,
    });
  }

  private async queryDeviceBelong(deviceId: string) {
    const tableId = await this.studioDeviceDataService.getDeviceBelongTo(deviceId);

    const gameId = await this.studioService.getStudioTableBelongTo(tableId);
    if (!gameId) {
      throw new StudioNotFoundError(`[studio] ${tableId} doesn't belong to any GameCode`);
    }

    const tableName = await this.tableApiQueryService.getTableName(gameId);
    return { gameId, tableId, tableName };
  }

  private async resolveErrorSignal(deviceId: string) {
    try {
      return await this.studioErrorSignalLogService.resolveErrorSignalLogsByDeviceId(deviceId);
    } catch (error) {
      const { code, message } = error as StudioApiError;
      this.logger.warn(`resolve error signal fail, code: ${code}, reason: ${message}`);
      return [];
    }
  }
}
