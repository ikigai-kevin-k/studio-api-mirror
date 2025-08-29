import { IkiError } from '@ikigaians/common';
import { LosErrorsEnum } from '../enums/los-errors.enum';

export class LosNotFoundTokenError extends IkiError {
  readonly code: LosErrorsEnum;

  constructor(message: string) {
    super(message);
    this.name = 'LosNotFoundTokenError';
    this.code = LosErrorsEnum.LOS_TOKEN_NOT_FOUND;
    Error.captureStackTrace(this, LosNotFoundTokenError);
  }
}
