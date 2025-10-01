import { ErrorCodeEnum } from 'src/global/enums/error-code.enum';
import { StudioApiError } from 'src/global/errors/error';

export class TableApiConnectFailureError extends StudioApiError {
  constructor(message: string) {
    super(ErrorCodeEnum.FORWARD_FAILURE, message);
    this.name = 'TableApiConnectFailureError';
    Error.captureStackTrace(this, TableApiConnectFailureError);
  }
}
