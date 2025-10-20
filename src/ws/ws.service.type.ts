import { ErrorSignalInput } from 'src/global/types/error-signal.type';
import { WsCloseCodeEnum, WsResponseType } from './ws.service.enum';

type WsAck = {
  timestamp: string;
};

type WsDeviceStatus = {
  deviceId: string;
  status: string;
};

type WsSignal = ErrorSignalInput;

export type Unsubscribe = () => void;

export type WsInput = { event: string; data: object };

export type WsOutput = WsAck | WsDeviceStatus | WsSignal;

export type WsErrorOutput = { code: number; message: string };

export type WsInstance = {
  send: (type: WsResponseType, output: WsOutput) => void;
  close: (code: WsCloseCodeEnum, output: WsErrorOutput) => void;
  error: (output: WsErrorOutput) => void;
};

export type ObserverCallback = (query: URLSearchParams, ws: WsInstance, data?: object) => void;
