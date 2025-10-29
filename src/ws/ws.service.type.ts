import { ErrorSignalInput } from 'src/global/types/error-signal.type';
import { WsConnection } from './ws.connection';

type WsAck = {
  timestamp: string;
};

type WsDeviceStatus = {
  deviceId: string;
  status: string;
  resolves: number[];
};

type WsSignal = ErrorSignalInput;

export type Unsubscribe = () => void;

export type WsInput = { event: string; data: object };

export type WsOutput = WsAck | WsDeviceStatus | WsSignal;

export type WsErrorOutput = { code: number; message: string };

export type WsInstance = WsConnection;

export type ObserverCallback = (query: URLSearchParams, ws: WsInstance, data?: object) => void;
