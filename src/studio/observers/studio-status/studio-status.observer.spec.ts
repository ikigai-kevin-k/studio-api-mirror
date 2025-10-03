// studio-status.service.spec.ts
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from '@ikigaians/logger';
import { StudioDeviceDataService } from 'src/studio/services/studio-device/studio-device-data.service';
import { StudioStatusService } from 'src/studio/services/studio-status/studio-status.service';
import { UpdateStudioStatusServiceInput } from 'src/studio/services/studio-status/studio-status.service.type';
import { WsService } from 'src/ws/ws.service';
import { StudioStatusObserver } from './studio-status.observer';

const mockWsService = {
  subscribe: jest.fn(),
} as unknown as WsService;

const mockStudioDeviceDataService = {
  getDeviceBelongTo: jest.fn(),
} as unknown as StudioDeviceDataService;

const mockStudioStatusService = {
  updateTableStatusByWebSocket: jest.fn(),
} as unknown as StudioStatusService;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

describe('StudioStatusObserver', () => {
  let service: StudioStatusObserver;

  beforeEach(() => {
    service = new StudioStatusObserver(
      mockStudioDeviceDataService,
      mockStudioStatusService,
      mockWsService,
      mockLoggerService,
    );
    jest.clearAllMocks();
  });

  describe('onInit and onDispose', () => {
    it('should subscribe to ws events on init and unsubscribe on dispose', async () => {
      const mockUnsubscribe = jest.fn();
      (mockWsService.subscribe as jest.Mock).mockReturnValue(mockUnsubscribe);

      await service.onInit();

      expect(mockWsService.subscribe).toHaveBeenCalled();

      await service.onDispose();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });

  describe('onServiceStatus', () => {
    it('should call updateTableStatusByWebSocket on valid message', async () => {
      const query = new URLSearchParams('id=ws-table');
      const ws = { send: jest.fn() } as any;
      const input: UpdateStudioStatusServiceInput = { uptime: 10 };

      (mockStudioDeviceDataService.getDeviceBelongTo as jest.Mock).mockReturnValue('tableId');
      (mockStudioStatusService.updateTableStatusByWebSocket as jest.Mock).mockResolvedValue({
        tableId: 'ws-table',
        uptime: 10,
      });

      await (service as any).onServiceStatus(query, ws, input);
      expect(mockStudioStatusService.updateTableStatusByWebSocket).toHaveBeenCalledWith(
        'tableId',
        input,
      );
      expect(ws.send).toHaveBeenCalled();
    });

    it('should log error if gameCode is missing', async () => {
      const query = new URLSearchParams('');
      const ws = { send: jest.fn() } as any;
      const input = {};
      await (service as any).onServiceStatus(query, ws, input);
      expect(mockLoggerService.error).toHaveBeenCalled();
    });
  });
});
