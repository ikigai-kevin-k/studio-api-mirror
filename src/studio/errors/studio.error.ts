import { StudioApiError } from 'src/utils/error-utils';
import { StudioErrorsEnum } from '../enums/studio-errors.enum';

export class StudioNotFoundError extends StudioApiError {
  constructor(message: string) {
    super(StudioErrorsEnum.STUDIO_TABLE_NOT_FOUND, message);
    this.name = 'StudioNotFoundError';
    Error.captureStackTrace(this, StudioNotFoundError);
  }
}

export class StudioWsAuthError extends StudioApiError {
  constructor(message: string) {
    super(StudioErrorsEnum.WS_AUTH_FAILURE, message);
    this.name = 'StudioWsAuthError';
    Error.captureStackTrace(this, StudioWsAuthError);
  }
}
