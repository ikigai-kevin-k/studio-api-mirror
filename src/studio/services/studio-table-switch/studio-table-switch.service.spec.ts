/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoggerService } from '@ikigaians/logger';

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
import { StudioTableSwitchService } from './studio-table-switch.service';
import { StudioTableSwitchServicePublishInput } from './studio-table-switch.service.type';

const mockStudioService = {
  getStudioTableBelongTo: jest.fn(),
} as unknown as StudioService;

const mockStudioGameService = {
  getGame: jest.fn(),
  switchCurrentTable: jest.fn(),
} as unknown as StudioGameService;

const mockStudioDeviceDataService = {
  getDeviceBelongTo: jest.fn(),
} as unknown as StudioDeviceDataService;

const mockStudioCdnService = {
  getTableCdn: jest.fn(),
} as unknown as StudioCdnService;

const mockKafkaStudioSwitchService = {
  publish: jest.fn(),
} as unknown as KafkaStudioSwitchService;

const mockWsService = {
  send: jest.fn(),
} as unknown as WsService;

const mockTableApiForwardService = {
  forwardCDN: jest.fn(),
} as unknown as TableApiForwardService;

const mockStudioDeviceDataRepository = {
  getDeviceByTableID: jest.fn(),
} as unknown as StudioDeviceDataRepository;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
} as unknown as LoggerService;

describe('StudioTableSwitchService', () => {
  let service: StudioTableSwitchService;

  beforeEach(() => {
    service = new StudioTableSwitchService(
      mockStudioService,
      mockStudioGameService,
      mockStudioDeviceDataService,
      mockStudioCdnService,
      mockKafkaStudioSwitchService,
      mockWsService,
      mockTableApiForwardService,
      mockStudioDeviceDataRepository,
      mockLoggerService,
    );
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(service.onInit()).resolves.toBeUndefined();
    });
  });

  describe('publish', () => {
    it('should send message to kafka', async () => {
      const input: StudioTableSwitchServicePublishInput = {
        deviceId: 'tableCode-1-sdp',
      };

      (mockStudioDeviceDataService.getDeviceBelongTo as jest.Mock).mockResolvedValueOnce(
        'tableCode-1',
      );
      (mockStudioService.getStudioTableBelongTo as jest.Mock).mockResolvedValueOnce('gameCode');
      (mockStudioGameService.getGame as jest.Mock).mockResolvedValueOnce({
        primaryTableId: 'tableCode-1',
        secondaryTableId: 'tableCode-2',
        currentTableId: 'tableCode-1',
      });

      (mockStudioDeviceDataRepository.getDeviceByTableID as jest.Mock).mockResolvedValueOnce({
        deviceId: 'tableCode-2-sdp',
      });
      (mockStudioCdnService.getTableCdn as jest.Mock).mockResolvedValueOnce({
        cdnDst: {
          primary: {},
          secondary: {},
        },
      });

      await service.publish(input);

      expect(mockStudioGameService.switchCurrentTable).toHaveBeenCalledWith('gameCode');
      expect(mockKafkaStudioSwitchService.publish).toHaveBeenCalledWith('tableCode-2-sdp');
      expect(mockStudioCdnService.getTableCdn).toHaveBeenCalledWith({ tableId: 'tableCode-2' });
      expect(mockTableApiForwardService.forwardCDN).toHaveBeenCalledWith('gameCode', {
        primary: {},
        secondary: {},
      });
    });

    it('if target table is using, does not call switchCurrentTable', async () => {
      const input: StudioTableSwitchServicePublishInput = {
        deviceId: 'tableCode-1-sdp',
      };

      (mockStudioDeviceDataService.getDeviceBelongTo as jest.Mock).mockResolvedValueOnce(
        'tableCode-1',
      );
      (mockStudioService.getStudioTableBelongTo as jest.Mock).mockResolvedValueOnce('gameCode');
      (mockStudioGameService.getGame as jest.Mock).mockResolvedValueOnce({
        primaryTableId: 'tableCode-1',
        secondaryTableId: 'tableCode-2',
        currentTableId: 'tableCode-2',
      });

      (mockStudioDeviceDataRepository.getDeviceByTableID as jest.Mock).mockResolvedValueOnce({
        deviceId: 'tableCode-2-sdp',
      });
      (mockStudioCdnService.getTableCdn as jest.Mock).mockResolvedValueOnce({
        cdnDst: {
          primary: {},
          secondary: {},
        },
      });

      await service.publish(input);

      expect(mockStudioGameService.switchCurrentTable).not.toHaveBeenCalled();
      expect(mockKafkaStudioSwitchService.publish).toHaveBeenCalledWith('tableCode-2-sdp');
      expect(mockStudioCdnService.getTableCdn).toHaveBeenCalledWith({ tableId: 'tableCode-2' });
      expect(mockTableApiForwardService.forwardCDN).toHaveBeenCalledWith('gameCode', {
        primary: {},
        secondary: {},
      });
    });

    it('should throw error if table does not belong to any game', async () => {
      const input: StudioTableSwitchServicePublishInput = {
        deviceId: 'tableCode-1-sdp',
      };

      (mockStudioDeviceDataService.getDeviceBelongTo as jest.Mock).mockResolvedValueOnce(
        'tableCode-1',
      );
      (mockStudioService.getStudioTableBelongTo as jest.Mock).mockResolvedValueOnce('');

      await expect(service.publish(input)).rejects.toThrow(StudioInvalidStateError);
    });
  });

  describe('handle', () => {
    it('should call send function', async () => {
      await service.handle({ deviceId: 'deviceId' });
      expect(mockWsService.send).toHaveBeenCalledWith('deviceId', WsResponseType.Device, {
        status: 'up',
      });
    });
  });
});
