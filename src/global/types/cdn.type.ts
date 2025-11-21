export type CdnSet = {
  lo: string;
  me: string;
  hi: string;
  hd: string;
};

export type CdnOutput = {
  primary: CdnSet;
  secondary: CdnSet;
};
