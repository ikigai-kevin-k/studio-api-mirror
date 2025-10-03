import { ErrorCodeEnum } from 'src/global/enums/error-code.enum';
import { StudioApiError } from 'src/global/errors/error';

export class KafkaDataNotFoundError extends StudioApiError {
  constructor(message: string) {
    super(ErrorCodeEnum.DATA_NOT_EXIST, message);
    this.name = 'KafkaDataNotFoundError';
    Error.captureStackTrace(this, KafkaDataNotFoundError);
  }
}

export class KafkaWsAuthFailureError extends StudioApiError {
  constructor(message: string) {
    super(ErrorCodeEnum.INVALID_AUTH_ERROR, message);
    this.name = 'KafkaWsAuthFailureError';
    Error.captureStackTrace(this, KafkaWsAuthFailureError);
  }
}
