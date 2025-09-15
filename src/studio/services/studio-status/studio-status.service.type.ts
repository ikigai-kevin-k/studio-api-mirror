import { Schema } from 'src/cache/cache.service.type';

export interface StudioStatusServiceOutput {
  tableId: string;
  uptime?: number;
  timestamp?: number;
  maintenance?: boolean;
  sdp?: string;
  idp?: string;
  broker?: string;
  zCam?: string;
  roulette?: string;
  shaker?: string;
  barcodeScanner?: string;
  nfcScanner?: string;
}

export const schema: Schema<StudioStatusServiceOutput> = {
  tableId: 'string',
  uptime: 'number',
  timestamp: 'number',
  maintenance: 'boolean',
  sdp: 'string',
  idp: 'string',
  broker: 'string',
  zCam: 'string',
  roulette: 'string',
  shaker: 'string',
  barcodeScanner: 'string',
  nfcScanner: 'string',
};

export type UpdateStudioStatusServiceInput = {
  uptime?: number;
  timestamp?: Date;
  maintenance?: boolean;
  sdp?: string;
  idp?: string;
  broker?: string;
  zCam?: string;
  roulette?: string;
  shaker?: string;
  barcodeScanner?: string;
  nfcScanner?: string;
};
