import { IkiError } from '@ikigaians/common';
import { TableApiErrorsEnum } from '../enums/tableapi-errors.enum';

export class TableApiConnectFailureError extends IkiError {
  readonly code: TableApiErrorsEnum;

  constructor(message: string) {
    super(message);
    this.name = 'TableApiConnectFailureError';
    this.code = TableApiErrorsEnum.TABLE_API_CONNECT_FAILURE;
    Error.captureStackTrace(this, TableApiConnectFailureError);
  }
}
