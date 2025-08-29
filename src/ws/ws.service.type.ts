import { WebSocket } from 'ws';

export type ObserverCallback = (query: URLSearchParams, ws: WebSocket, data?: string) => void;

export type Unsubscribe = () => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WsFormat = { event: string; data: any };
