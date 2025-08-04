export type UpsertTableCdnResult = {
  TABLE_ID: string;
  PRIMARY_HD: string;
  PRIMARY_HI: string;
  PRIMARY_ME: string;
  PRIMARY_LO: string;
  SECONDARY_HD: string;
  SECONDARY_HI: string;
  SECONDARY_ME: string;
  SECONDARY_LO: string;
};

export type UpdateTableCdnPrimaryEntity = {
  tableId: string;
  primaryHd: string;
  primaryHi: string;
  primaryMe: string;
  primaryLo: string;
};

export type UpdateTableCdnSecondaryEntity = {
  tableId: string;
  secondaryHd: string;
  secondaryHi: string;
  secondaryMe: string;
  secondaryLo: string;
};
