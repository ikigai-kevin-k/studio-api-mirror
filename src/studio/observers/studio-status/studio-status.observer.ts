import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { StudioStatusService } from 'src/studio/services/studio-status/studio-status.service';
import { UpdateStudioStatusServiceInput } from 'src/studio/services/studio-status/studio-status.service.type';
import { WsService } from 'src/ws/ws.service';
import { Unsubscribe } from 'src/ws/ws.service.type';
import { WebSocket } from 'ws';

export class StudioStatusObserver implements ModuleLifecycle {
  private unSubscribes: Unsubscribe[] = [];
  constructor(
    private readonly studioStatusService: StudioStatusService,
    private readonly wsService: WsService,
    private readonly logger: LoggerService,
  ) {}

  private async onServiceStatus(query: URLSearchParams, ws: WebSocket, data?: object) {
    try {
      const tableId = query.get('id');
      if (!tableId) throw new Error(`Ws connect without tableId !!`);

      const result = await this.studioStatusService.updateTableStatusByWebSocket(
        tableId,
        data as UpdateStudioStatusServiceInput,
      );
      ws.send(JSON.stringify(result));
    } catch (error) {
      const reason = (error as Error).toString();
      this.logger.error(reason);
    }
  }

  async onInit(): Promise<void> {
    this.unSubscribes = [
      this.wsService.subscribe('service_status', this.onServiceStatus.bind(this)),
      // Provide a provisional handling for the legacy format
      // this should be removed after the source updates the packet format.
      this.wsService.subscribe('unknown', this.onServiceStatus.bind(this)),
    ];
  }

  async onDispose(): Promise<void> {
    for (const unSubscribe of this.unSubscribes) {
      unSubscribe();
    }
  }
}
