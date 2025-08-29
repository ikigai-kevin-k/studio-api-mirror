export type CdnDestination = {
  lo: string;
  me: string;
  hi: string;
  hd: string;
};

export type CdnGroup = {
  primary: CdnDestination;
  secondary: CdnDestination;
};

export type SignalData = {
  msgId: string;
  metadata: Record<string, string>;
};
