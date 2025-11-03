type CdnSet = {
  lo: string;
  me: string;
  hi: string;
  hd: string;
};

export type TableApiForwardInput = {
  primary: CdnSet;
  secondary: CdnSet;
};
