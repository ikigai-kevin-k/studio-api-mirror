import { IkiError } from '@ikigaians/common';

export class StudioApiError extends IkiError {
  readonly code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}
