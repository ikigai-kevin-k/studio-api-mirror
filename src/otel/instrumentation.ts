/* istanbul ignore file */
import FastifyOtelInstrumentation from '@fastify/otel';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import dotenv from 'dotenv';
import { randomUUID } from 'node:crypto';

// print opentelemetry warnings
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.WARN);

dotenv.config();

const exportURL = process.env.OTEL_TRACE_EXPORT_URL;

if (exportURL) {
  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: process.env.APP_NAME || 'live-unknown',
      [ATTR_SERVICE_VERSION]: '',
      ['service.instance.id']: randomUUID(),
      ['deployment.environment.name']: process.env.APP_ENV,
    }),
    traceExporter: new OTLPTraceExporter({ url: exportURL }),
    instrumentations: [
      getNodeAutoInstrumentations(),
      new FastifyOtelInstrumentation({ registerOnInitialization: true }),
    ],
    logRecordProcessors: [],
  });
  sdk.start();
  process.on('SIGTERM', () => {
    sdk
      .shutdown()
      .then(() => console.log('otel sdk closed'))
      .catch((error) => console.error('error terminating otel', error));
  });
}
