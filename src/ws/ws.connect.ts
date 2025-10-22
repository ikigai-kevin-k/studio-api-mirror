import { WebSocket } from '@fastify/websocket';
import { LoggerService } from '@ikigaians/logger';
import { ErrorCodeEnum } from 'src/global/enums/error-code.enum';
import { StudioApiError } from 'src/global/errors/error';
import { WsInvalidError } from './ws.error';
import { WsCloseCodeEnum, WsResponseType } from './ws.service.enum';
import { WsErrorOutput, WsInput, WsOutput } from './ws.service.type';

export class WsConnection {
  constructor(
    private readonly id: string,
    private readonly ws: WebSocket,
    private readonly logger: LoggerService,
  ) {}

  get isOpen() {
    return this.ws.readyState === this.ws.OPEN;
  }

  get isClosed() {
    return this.ws.readyState === this.ws.CLOSED;
  }

  onMessage(callback: (message: WsInput) => void) {
    this.ws.on('message', (message) => {
      try {
        const rawData = JSON.parse(message.toString()) as WsInput;
        if (!rawData.event) {
          throw new WsInvalidError(`${this.id} send an invalid data => ${message.toString()}`);
        }

        callback(rawData);
      } catch (error) {
        const { code, message } = error as StudioApiError;
        const errCode = code || ErrorCodeEnum.INVALID_STATE;
        this.logger.warn(
          `[ws] ${this.id} send an invalid data, code: ${errCode}, reason: ${message}`,
        );
        this.error({ code: errCode, message: message });
      }
    });
  }

  onClose(callback: () => void) {
    this.ws.on('close', callback);
  }

  send(type: WsResponseType, output: WsOutput) {
    this.ws.send(JSON.stringify({ type: type, data: output }));
  }

  close(code: WsCloseCodeEnum, output: WsErrorOutput) {
    this.ws.close(code, JSON.stringify({ type: WsResponseType.Kick, error: output }));
  }

  error(output: WsErrorOutput) {
    this.ws.send(JSON.stringify({ type: WsResponseType.Error, error: output }));
  }
}
