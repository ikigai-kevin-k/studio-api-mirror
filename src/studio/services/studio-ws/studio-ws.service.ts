import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { WsService } from 'src/ws/ws.service';
import { WsCloseCodeEnum } from 'src/ws/ws.service.enum';
import { Unsubscribe } from 'src/ws/ws.service.type';
import { WebSocket } from 'ws';
import { StudioCacheService } from '../studio-cache/studio-cache.service';
import { StudioStatusService } from '../studio-status/studio-status.service';

export class StudioWsService implements ModuleLifecycle {
  private unSubscribes: Unsubscribe[] = [];
  constructor(
    private readonly wsService: WsService,
    private readonly studioStatusService: StudioStatusService,
    private readonly studioCacheService: StudioCacheService,
    private readonly logger: LoggerService,
  ) {}

  private parserParams(query: URLSearchParams) {
    return {
      tableId: query.get('id') || '',
      device: query.get('device') || '',
    };
  }

  private async onConnect(query: URLSearchParams, ws: WebSocket) {
    const params = this.parserParams(query);
    const cache = await this.studioCacheService.getCache('status', params.tableId);
    if (!cache) {
      ws.close(WsCloseCodeEnum.Unauthorized, `Unknown tableId = ${params.tableId}`);
      return;
    }

    ws.send(`Welcome to StudioAPI, ${params.tableId}::${params.device}`);

    this.logger.info(`${params.tableId}::${params.device} login`);
  }

  private onDisconnect(query: URLSearchParams) {
    const params = this.parserParams(query);
    this.logger.info(`${params.tableId}::${params.device} logout`);
  }

  private async onMessage(query: URLSearchParams, ws: WebSocket, data?: string) {
    const params = this.parserParams(query);
    this.logger.info(`${params.tableId}::${params.device} send = ${data}`);

    try {
      const input = JSON.parse(data ?? '{}');
      const result = await this.studioStatusService.updateTableStatusByWebSocket(
        params.tableId,
        input,
      );
      ws.send(JSON.stringify(result));
    } catch (error) {
      const reason = (error as Error).toString();
      ws.send(reason);
    }
  }

  async onInit(): Promise<void> {
    this.unSubscribes = [
      this.wsService.subscribe('connection', this.onConnect.bind(this)),
      this.wsService.subscribe('close', this.onDisconnect.bind(this)),
      this.wsService.subscribe('message', this.onMessage.bind(this)),
    ];
  }

  async onDispose(): Promise<void> {
    for (const unSubscribe of this.unSubscribes) {
      unSubscribe();
    }
  }
}
