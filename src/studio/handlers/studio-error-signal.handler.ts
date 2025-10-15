import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { KafkaLosSignalService } from 'src/kafka/services/kafka-los-signal/kafka-los-signal.service';
import { StudioDeviceDataService } from 'src/studio/services/studio-device/studio-device-data.service';
import { StudioService } from 'src/studio/services/studio/studio.service';

import { StudioErrorSignalLogService } from 'src/studio/services/studio-log/studio-error-signal-log.service';
import { TableApiQueryService } from 'src/table-api/services/table-api-query/table-api-query.service';
import { TableApiSignalService } from 'src/table-api/services/table-api-signal/table-api-signal.service';
import { StudioInvalidStateError, StudioNotFoundError } from '../errors/studio.error';
import { StudioErrorSignalHandlerInput } from './studio-error-signal.handler.type';

export class StudioErrorSignalHandler implements ModuleLifecycle {
  constructor(
    private readonly tableApiQueryService: TableApiQueryService,
    private readonly studioDeviceDataService: StudioDeviceDataService,
    private readonly studioService: StudioService,
    private readonly studioErrorSignalLogService: StudioErrorSignalLogService,
    private readonly kafkaLosSignalService: KafkaLosSignalService,
    private readonly tableApiSignalService: TableApiSignalService,
    private readonly logger: LoggerService,
  ) {}

  private async insertSignalLog(deviceId: string, data: StudioErrorSignalHandlerInput) {
    const hasUnResolved = await this.studioErrorSignalLogService.isUnResolvedLogExist(deviceId);
    if (hasUnResolved) {
      throw new StudioInvalidStateError(
        `[studio_error_signal_log] ${deviceId} has unresolved error signal log`,
      );
    }

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
    return { gameId, tableName };
  }

  async forwardErrorSignal(deviceId: string, signal: StudioErrorSignalHandlerInput) {
    const { gameId, tableName } = await this.queryDeviceBelong(deviceId);
    const output = {
      ...signal,
      metadata: { ...signal.metadata },
    };
    output.metadata.gameCode = gameId;
    output.metadata.tableName = tableName;

    const log = await this.insertSignalLog(deviceId, output);
    output.metadata.signalId = log.id;

    await Promise.all([
      this.kafkaLosSignalService.publish(output),
      this.tableApiSignalService.forwardSignal(gameId, output),
    ]);

    return output;
  }

  async forwardResolveSignal(deviceId: string) {
    const result = await this.studioErrorSignalLogService.updateLog({ deviceId: deviceId });
    // TODO: forward to LOS

    return result;
  }

  async onInit(): Promise<void> {}
}
