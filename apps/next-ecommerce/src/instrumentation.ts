import { registerOTel } from '@vercel/otel';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import {
  ConsoleSpanExporter,
  BatchSpanProcessor,
} from '@opentelemetry/sdk-trace-base';

const traceExporter = new OTLPTraceExporter({
  timeoutMillis: 2000,
});

// export spans to console (useful for debugging)
const consoleProcessor = new BatchSpanProcessor(new ConsoleSpanExporter());
const spanProcessors = new BatchSpanProcessor(traceExporter);

export function register() {
  registerOTel({
    serviceName: 'bhanuj.app',
    traceExporter: traceExporter,
    spanProcessors: [consoleProcessor, spanProcessors],
  });
}
