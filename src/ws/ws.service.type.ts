import { WebSocket } from 'ws';

export type ObserverCallback = (query: URLSearchParams, ws: WebSocket, data?: object) => void;

export type Unsubscribe = () => void;

export type WsFormat = { event: string; data: object };
