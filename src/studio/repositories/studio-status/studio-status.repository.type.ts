export type GetTableStatusQuery = {
  tableId?: string;
};

export type GetTableStatusResult = {
  tableId: string;
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
};

export type InsertTableStatusResult = {
  TABLE_ID: string;
  UPTIME: number;
  TIMESTAMP: Date;
  MAINTENANCE: boolean;
  SDP: string;
  IDP: string;
  BROKER: string;
  Z_CAM: string;
  ROULETTE: string;
  SHAKER: string;
  BARCODE_SCANNER: string;
  NFC_SCANNER: string;
};

export type UpdateTableStatusEntity = {
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
