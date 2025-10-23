import { LoggerService as IkgLogger, PrettyLogger, StdoutLogger } from '@ikigaians/logger';

export class LoggerService extends IkgLogger {
  constructor() {
    super();
    this.initial();
  }

  private initial() {
    if (process.env.LOG_PRETTY === 'true') {
      this.append(new PrettyLogger());
    } else {
      this.append(new StdoutLogger());
    }
  }
}
