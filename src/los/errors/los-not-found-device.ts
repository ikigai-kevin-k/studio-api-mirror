import { IkiError } from '@ikigaians/common';
import { LosErrorsEnum } from '../enums/los-errors.enum';

export class LosNotFoundDeviceError extends IkiError {
  readonly code: LosErrorsEnum;

  constructor(message: string) {
    super(message);
    this.name = 'LosNotFoundDeviceError';
    this.code = LosErrorsEnum.LOS_DEVICE_NOT_FOUND;
    Error.captureStackTrace(this, LosNotFoundDeviceError);
  }
}
