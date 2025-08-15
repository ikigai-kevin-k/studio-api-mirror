import { WebSocket } from 'ws';

export type WSObserverEvent = 'connection' | 'message' | 'close';

export type ObserverCallback = (query: URLSearchParams, ws: WebSocket, data?: string) => void;

export type Unsubscribe = () => void;
