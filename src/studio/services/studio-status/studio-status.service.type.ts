import { StudioCacheData } from '../studio-cache/studio-cache.service.type';

export type GetTableStatusQuery = {
  tableId?: string;
};

export type TableStatusResult = {
  uptime: number;
  timestamp: Date;
  maintenance: boolean;
  sdp: string;
  idp: string;
  broker: string;
  zCam: string;
  roulette: string;
  shaker: string;
  barcodeScanner: string;
  nfcScanner: string;
};

export interface GetTableStatusOutput extends StudioCacheData {
  uptime: number;
  timestamp: number;
  maintenance: boolean;
  sdp: string;
  idp: string;
  broker: string;
  zCam: string;
  roulette: string;
  shaker: string;
  barcodeScanner: string;
  nfcScanner: string;
}

export interface InsertTableStatusOutput extends StudioCacheData {
  uptime: number;
  timestamp: number;
  maintenance: boolean;
  sdp: string;
  idp: string;
  broker: string;
  zCam: string;
  roulette: string;
  shaker: string;
  barcodeScanner: string;
  nfcScanner: string;
}
