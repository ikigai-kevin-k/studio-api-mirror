import { IkiError } from '@ikigaians/common';
import { LosErrorsEnum } from '../enums/los-errors.enum';

export class LosConnectFailureError extends IkiError {
  readonly code: LosErrorsEnum;

  constructor(message: string) {
    super(message);
    this.name = 'LosConnectFailureError';
    this.code = LosErrorsEnum.LOS_CONNECT_FAILURE;
    Error.captureStackTrace(this, LosConnectFailureError);
  }
}
