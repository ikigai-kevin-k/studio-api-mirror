import { LoggerService as IkgLogger, ILogger, PrettyLogger, StdoutLogger } from '@ikigaians/logger';
import { getClassName } from '@ikigaians/mod';
import { Constructor } from 'awilix';

export class LoggerService extends IkgLogger {
  private registers = new Map<string, ILogger>();
  public consoleLogger: ILogger = {
    trace: console.trace,
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
    fatal: console.error,
  };

  constructor() {
    super();
    this.initial();
    this.register(this.consoleLogger);
  }

  register(...loggers: (Constructor<ILogger> | ILogger)[]) {
    for (const logger of loggers) {
      const instance = typeof logger === 'function' ? new logger() : logger;
      this.registers.set(getClassName(instance), instance);
    }
    this.refresh();
  }

  unregister(...loggers: (Constructor<ILogger> | ILogger)[]) {
    for (const logger of loggers) {
      this.registers.delete(getClassName(logger));
    }
    this.refresh();
  }

  private refresh() {
    this['loggers'] = [...this.registers.values()];
  }

  private initial() {
    if (process.env.LOG_PRETTY === 'true') {
      this.append(new PrettyLogger());
    } else {
      this.append(new StdoutLogger());
    }
  }
}
