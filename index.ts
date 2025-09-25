import 'src/otel/instrumentation';
// instrumentation must be imported first
import { ModuleManager } from '@ikigaians/mod';
import tracer from 'dd-trace';
import { startApp } from 'src/app';
import { LoggerService } from 'src/log';
import { StudioMod } from 'src/mod';

tracer.init({
  service: process.env.APP_NAME,
  env: process.env.APP_ENV,
  version: process.env.VERSION || 'unknown',
});

startApp(new ModuleManager(LoggerService).registerProfile(...StudioMod));
