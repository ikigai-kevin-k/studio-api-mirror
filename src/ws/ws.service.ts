import { ModuleLifecycle } from '@ikigaians/mod';
import { AppConfigService } from 'src/config';
import { LoggerService } from 'src/log';
import { WebSocket, WebSocketServer } from 'ws';
import { WsCloseCodeEnum } from './ws.service.enum';
import { ObserverCallback, WsFormat } from './ws.service.type';

export class WsService implements ModuleLifecycle {
  private wss?: WebSocketServer;

  private observers = new Map<string, ObserverCallback[]>();

  constructor(
    private readonly logger: LoggerService,
    private readonly appConfigService: AppConfigService,
  ) {}

  private handleConnect() {
    this.logger.info(`create WsService`);
    this.wss?.on('connection', (ws, req) => {
      const query = new URL(req.url!, `http://${req.headers.host}`).searchParams;
      const token = query.get('token') || '';

      try {
        if (token !== this.appConfigService.wsConfig.token) throw `Invalid credentials`;

        ws.on('message', (message) => {
          const rawData = JSON.parse(message.toString()) as WsFormat;
          // Provide a provisional handling for the legacy format
          // this should be removed after the source updates the packet format.
          this.notify(rawData.event ?? 'unknown', query, ws, rawData.data ?? rawData);
        });

        ws.on('close', () => {
          this.notify('close', query, ws);
        });

        this.notify('connection', query, ws);
      } catch (error) {
        const reason = error as string;
        this.logger.warn(reason);
        ws.close(WsCloseCodeEnum.Unauthorized, reason);
      }
    });
  }

  subscribe(event: string, callback: ObserverCallback) {
    if (!this.observers.has(event)) {
      this.observers.set(event, []);
    }
    this.observers.get(event)!.push(callback);

    return () => {
      const cbs = this.observers.get(event);
      if (!cbs) return;
      const idx = cbs.indexOf(callback);
      if (idx !== -1) cbs.splice(idx, 1);
    };
  }

  private notify(event: string, query: URLSearchParams, ws: WebSocket, data?: object) {
    const cbs = this.observers.get(event);
    if (!cbs) return;
    for (const cb of cbs) cb(query, ws, data);
  }

  broadcast(message: string) {
    for (const client of this.wss?.clients ?? []) {
      if (client.readyState === client.OPEN) client.send(message);
    }
  }

  async onInit() {
    return await new Promise<void>((resolve, rejects) => {
      this.wss = new WebSocketServer({ port: this.appConfigService.wsConfig.port });
      this.wss.once('listening', () => {
        this.handleConnect();
        resolve();
      });
      this.wss?.once('error', rejects);
    });
  }

  async onDispose(): Promise<void> {
    for (const client of this.wss?.clients ?? []) {
      if (client.readyState === client.OPEN)
        client.close(WsCloseCodeEnum.GoingAway, 'StudioAPI shutting down');
    }

    return await new Promise((resolve, rejects) => {
      this.wss?.close((err) => {
        if (err) rejects(err);
        resolve();
      });
    });
  }
}
