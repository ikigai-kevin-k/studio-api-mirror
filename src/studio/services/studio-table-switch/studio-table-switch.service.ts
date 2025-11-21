import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';

import { KafkaStudioSwitchService } from 'src/kafka/services/kafka-studio-switch/kafka-studio-switch.service';
import { StudioInvalidStateError } from 'src/studio/errors/studio.error';
import { StudioDeviceDataRepository } from 'src/studio/repositories/studio-device/studio-device-data.repository';
import { StudioDeviceDataService } from 'src/studio/services/studio-device/studio-device-data.service';
import { StudioService } from 'src/studio/services/studio/studio.service';
import { TableApiForwardService } from 'src/table-api/services/table-api-forward/table-api-forward.service';
import { WsService } from 'src/ws/ws.service';
import { WsResponseType } from 'src/ws/ws.service.enum';
import { StudioCdnService } from '../studio-cdn/studio-cdn.service';
import { StudioGameService } from '../studio-game/studio-game.service';
import {
  StudioTableSwitchServiceHandleInput,
  StudioTableSwitchServicePublishInput,
} from './studio-table-switch.service.type';

export class StudioTableSwitchService implements ModuleLifecycle {
  constructor(
    private readonly studioService: StudioService,
    private readonly studioGameService: StudioGameService,
    private readonly studioDeviceDataService: StudioDeviceDataService,
    private readonly studioCdnService: StudioCdnService,
    private readonly kafkaStudioSwitchService: KafkaStudioSwitchService,
    private readonly wsService: WsService,
    private readonly tableApiForwardService: TableApiForwardService,
    private readonly studioDeviceDataRepository: StudioDeviceDataRepository,
    private readonly logger: LoggerService,
  ) {}

  async onInit(): Promise<void> {}

  async publish(input: StudioTableSwitchServicePublishInput) {
    const deviceId = input.deviceId;
    const tableId = await this.studioDeviceDataService.getDeviceBelongTo(deviceId);

    const gameId = await this.studioService.getStudioTableBelongTo(tableId);
    if (!gameId) {
      throw new StudioInvalidStateError(`table ${tableId} does not belong to any game !`);
    }

    const game = await this.studioGameService.getGame({ gameId });
    const targetTableId =
      game.primaryTableId === tableId ? game.secondaryTableId : game.primaryTableId;

    if (targetTableId !== game.currentTableId) {
      await this.studioGameService.switchCurrentTable(gameId);
    }

    const targetDevice = await this.studioDeviceDataRepository.getDeviceByTableID(targetTableId);

    await this.kafkaStudioSwitchService.publish(targetDevice.deviceId);

    const cdn = await this.studioCdnService.getTableCdn({ tableId: targetTableId });
    await this.tableApiForwardService.forwardCDN(gameId, {
      primary: cdn.cdnDst['primary'],
      secondary: cdn.cdnDst['secondary'],
    });
  }

  async handle(input: StudioTableSwitchServiceHandleInput) {
    this.wsService.send(input.deviceId, WsResponseType.Device, { status: 'up' });
  }
}
