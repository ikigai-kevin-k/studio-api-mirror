import { WebSocket } from '@fastify/websocket';
import { ModuleLifecycle } from '@ikigaians/mod';
import { AppConfigService } from 'src/config';
import { ErrorCodeEnum } from 'src/global/enums/error-code.enum';
import { StudioApiError } from 'src/global/errors/error';
import { LoggerService } from 'src/log';
import { SlackService } from 'src/slack/slack.service';
import { WsConnection } from './ws.connect';
import { WsAuthError } from './ws.error';
import { WsCloseCodeEnum, WsResponseType } from './ws.service.enum';
import { ObserverCallback, WsOutput } from './ws.service.type';

export class WsService implements ModuleLifecycle {
  private observers = new Map<string, ObserverCallback[]>();

  private listeners = new Map<string, WsConnection>();

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
      const connection = new WsConnection(id, ws, this.logger);
      this.listeners.set(id, connection);

      connection.onMessage((message) => {
        this.notify(message.event, query, connection, message.data);
      });

      connection.onClose(() => {
        this.notify('close', query, connection);
        this.leave(id);
      });

      this.notify('connection', query, connection);
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

  private notify(event: string, query: URLSearchParams, connection: WsConnection, data?: object) {
    const cbs = this.observers.get(event);
    if (!cbs) return;

    for (const cb of cbs) cb(query, connection, data);
  }

  private leave(id: string) {
    const connection = this.listeners.get(id);
    if (!connection) return;

    if (connection.isOpen) {
      connection.close(WsCloseCodeEnum.GoingAway, {
        code: ErrorCodeEnum.INVALID_STATE,
        message: 'duplicate login',
      });
      this.logger.info(`[ws] studio api kick ${id} out, because of duplicate login`);
    }

    this.listeners.delete(id);
  }

  broadcast(type: WsResponseType, message: WsOutput) {
    for (const [, connection] of this.listeners) {
      if (connection.isOpen) {
        connection.send(type, message);
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

    for (const [, connection] of this.listeners) {
      if (connection.isOpen) {
        connection.close(WsCloseCodeEnum.ServiceRestart, {
          code: ErrorCodeEnum.INVALID_STATE,
          message: 'StudioAPI shutting down',
        });
      }
    }

    this.listeners.clear();
  }
}
