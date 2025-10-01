import { ErrorCodeEnum } from 'src/global/enums/error-code.enum';
import { StudioApiError } from 'src/global/errors/error';

export class StudioNotFoundError extends StudioApiError {
  constructor(message: string) {
    super(ErrorCodeEnum.DATA_NOT_EXIST, message);
    this.name = 'StudioNotFoundError';
    Error.captureStackTrace(this, StudioNotFoundError);
  }
}

export class StudioUpdateError extends StudioApiError {
  constructor(message: string) {
    super(ErrorCodeEnum.DATA_NOT_MODIFIED, message);
    this.name = 'StudioUpdateError';
    Error.captureStackTrace(this, StudioUpdateError);
  }
}

export class StudioWsAuthError extends StudioApiError {
  constructor(message: string) {
    super(ErrorCodeEnum.INVALID_AUTH_ERROR, message);
    this.name = 'StudioWsAuthError';
    Error.captureStackTrace(this, StudioWsAuthError);
  }
}
