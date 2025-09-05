// studio-status.service.spec.ts
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from '@ikigaians/logger';
import { StudioStatusService } from 'src/studio/services/studio-status/studio-status.service';
import { UpdateStudioStatusServiceInput } from 'src/studio/services/studio-status/studio-status.service.type';
import { WsService } from 'src/ws/ws.service';
import { StudioStatusObserver } from './studio-status.observer';

const mockWsService = {
  subscribe: jest.fn(),
} as unknown as WsService;

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
    service = new StudioStatusObserver(mockStudioStatusService, mockWsService, mockLoggerService);
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
      (mockStudioStatusService.updateTableStatusByWebSocket as jest.Mock).mockResolvedValue({
        tableId: 'ws-table',
        uptime: 10,
      });

      await (service as any).onServiceStatus(query, ws, input);
      expect(mockStudioStatusService.updateTableStatusByWebSocket).toHaveBeenCalledWith(
        'ws-table',
        input,
      );
      expect(ws.send).toHaveBeenCalled();
    });

    it('should log error if tableId is missing', async () => {
      const query = new URLSearchParams('');
      const ws = { send: jest.fn() } as any;
      const input = {};
      await (service as any).onServiceStatus(query, ws, input);
      expect(mockLoggerService.error).toHaveBeenCalledWith('Error: Ws connect without tableId !!');
    });
  });
});
