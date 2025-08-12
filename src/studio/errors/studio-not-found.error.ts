import { IkiError } from '@ikigaians/common';
import { StudioErrorsEnum } from '../enums/studio-errors.enum';

export class StudioNotFoundError extends IkiError {
  readonly code: StudioErrorsEnum;

  constructor(message: string) {
    super(message);
    this.name = 'StudioNotFoundError';
    this.code = StudioErrorsEnum.STUDIO_TABLE_NOT_FOUND;
    Error.captureStackTrace(this, StudioNotFoundError);
  }
}
