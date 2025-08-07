/* eslint-disable @typescript-eslint/no-explicit-any */
import { StudioTableStatusEnum } from '../../enums/studio.enums';

export type StudioCacheResult = {
  tableId: string;
  tableStatus: StudioTableStatusEnum;
  cdnDst: Record<string, any>;
};

export function EmptyStudioCacheResult() {
  return {
    tableId: '',
    tableStatus: StudioTableStatusEnum.INACTIVE,
    cdnDst: {
      primary: {
        lo: '',
        me: '',
        hi: '',
        hd: '',
      },
      secondary: {
        lo: '',
        me: '',
        hi: '',
        hd: '',
      },
    },
  } as StudioCacheResult;
}
