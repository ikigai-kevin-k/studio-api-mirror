import { ErrorCodeEnum } from 'src/global/enums/error-code.enum';
import { StudioApiError } from 'src/global/errors/error';

export class WsAuthError extends StudioApiError {
  constructor(message: string) {
    super(ErrorCodeEnum.INVALID_AUTH_ERROR, message);
    this.name = 'WsAuthError';
    Error.captureStackTrace(this, WsAuthError);
  }
}

export class WsInvalidError extends StudioApiError {
  constructor(message: string) {
    super(ErrorCodeEnum.INVALID_STATE, message);
    this.name = 'WsInvalidError';
    Error.captureStackTrace(this, WsInvalidError);
  }
}
