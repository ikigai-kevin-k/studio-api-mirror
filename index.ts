import tracer from 'dd-trace';
tracer.init({
  service: process.env.APP_NAME,
  env: process.env.APP_ENV,
  version: process.env.VERSION || 'unknown',
});

import 'src/otel/instrumentation';
// instrumentation must be imported first
import { ModuleManager } from '@ikigaians/mod';

import { startApp } from 'src/app';
import { LoggerService } from 'src/log';
import { StudioMod } from 'src/mod';

startApp(new ModuleManager(LoggerService).registerProfile(...StudioMod));
