import { WebSocket } from '@fastify/websocket';
import { ModuleLifecycle } from '@ikigaians/mod';
import { AppConfigService } from 'src/config';
import { ErrorCodeEnum } from 'src/global/enums/error-code.enum';
import { StudioApiError } from 'src/global/errors/error';
import { LoggerService } from 'src/log';
import { SlackService } from 'src/slack/slack.service';
import { WsAuthError, WsInvalidError } from './ws.error';
import { WsCloseCodeEnum, WsResponseType } from './ws.service.enum';
import { ObserverCallback, WsErrorOutput, WsInput, WsOutput } from './ws.service.type';

export class WsService implements ModuleLifecycle {
  private observers = new Map<string, ObserverCallback[]>();

  private listeners = new Map<string, WebSocket>();

  private ackTimer: NodeJS.Timeout | undefined = undefined;

  constructor(
    private readonly slackService: SlackService,
    private readonly logger: LoggerService,
    private readonly appConfigService: AppConfigService,
  ) {}

  handleConnect(ws: WebSocket, query: URLSearchParams) {
    try {
      const id = query.get('id');
      if (!id) throw new WsAuthError('id does not exist');

      const token = query.get('token') || '';
      if (token !== this.appConfigService.wsConfig.token) {
        throw new WsAuthError(`${id} has an invalid token`);
      }

      this.leave(id);
      this.listeners.set(id, ws);

      ws.on('message', (message) => {
        const rawData = JSON.parse(message.toString()) as WsInput;
        if (!rawData.event) {
          throw new WsInvalidError(`${id} send an invalid data => ${message.toString()}`);
        }

        this.notify(rawData.event, query, ws, rawData.data);
      });

      ws.on('close', () => {
        this.notify('close', query, ws);
        this.leave(id);
      });

      this.notify('connection', query, ws);
    } catch (error) {
      const { code, message } = error as StudioApiError;
      const msg = `ws connect status fail, code: ${code}, reason: ${message}`;
      this.logger.warn(msg);
      this.slackService.broadcast(msg);
      ws.close(
        WsCloseCodeEnum.Unauthorized,
        JSON.stringify({ type: WsResponseType.Kick, error: { code: code, message: message } }),
      );
    }
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

    const inst = {
      send: (type: WsResponseType, output: WsOutput) => {
        ws.send(JSON.stringify({ type: type, data: output }));
      },
      close: (code: WsCloseCodeEnum, output: WsErrorOutput) => {
        ws.close(code, JSON.stringify({ type: WsResponseType.Kick, error: output }));
      },
      error: (output: WsErrorOutput) => {
        ws.send(JSON.stringify({ type: 'error', error: output }));
      },
    };
    for (const cb of cbs) cb(query, inst, data);
  }

  private leave(id: string) {
    const client = this.listeners.get(id);
    if (!client) return;

    if (client.readyState === client.OPEN) {
      client.close(
        WsCloseCodeEnum.GoingAway,
        JSON.stringify({
          type: WsResponseType.Kick,
          error: { code: ErrorCodeEnum.INVALID_STATE, message: 'duplication login' },
        }),
      );
      this.logger.info(`[ws] studio api kick ${id} out, because of duplication`);
    }

    this.listeners.delete(id);
  }

  broadcast(type: WsResponseType, message: WsOutput) {
    const msg = JSON.stringify({ type: type, data: message });
    for (const listener of this.listeners) {
      const client = listener[1];
      if (client.readyState === client.OPEN) {
        client.send(msg);
      }
    }
  }

  private ack() {
    this.broadcast(WsResponseType.Ack, { timestamp: new Date().toISOString() });
  }

  async onInit() {
    this.ackTimer = setInterval(this.ack.bind(this), this.appConfigService.wsConfig.interval);
  }

  async onDispose(): Promise<void> {
    clearInterval(this.ackTimer);
    this.ackTimer = undefined;

    for (const listener of this.listeners) {
      const client = listener[1];
      if (client.readyState === client.OPEN) {
        client.close(WsCloseCodeEnum.GoingAway, 'StudioAPI shutting down');
      }
    }

    this.listeners.clear();
  }
}
