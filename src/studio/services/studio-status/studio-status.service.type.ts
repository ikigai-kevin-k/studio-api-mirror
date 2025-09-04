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
