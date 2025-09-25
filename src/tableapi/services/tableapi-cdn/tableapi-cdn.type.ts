export type CdnDestination = {
  lo: string;
  me: string;
  hi: string;
  hd: string;
};

export type TableApiCdnServiceInput = {
  primary: CdnDestination;
  secondary: CdnDestination;
};
