import { StudioTableStatusType } from '../../enums/studio.enums';

export type StudioCacheResult = {
  tableId: string;
  tableStatus: StudioTableStatusType;
  primaryHd: string;
  primaryHi: string;
  primaryMe: string;
  primaryLo: string;
  secondaryHd: string;
  secondaryHi: string;
  secondaryMe: string;
  secondaryLo: string;
};

export function EmptyStudioCacheResult() {
  return {
    tableId: '',
    tableStatus: StudioTableStatusType.INACTIVE,
    primaryHd: '',
    primaryHi: '',
    primaryMe: '',
    primaryLo: '',
    secondaryHd: '',
    secondaryHi: '',
    secondaryMe: '',
    secondaryLo: '',
  } as StudioCacheResult;
}
