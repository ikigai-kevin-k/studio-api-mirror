import cors from '@fastify/cors';
import fastifyRequestContext from '@fastify/request-context';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { AppEnvsEnum } from '@ikigaians/common';
import { ModuleLifecycle } from '@ikigaians/mod';
import { setErrorHandler, setGeneralResponseHook } from '@ikigaians/web';
import fastify, { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { AppConfigService } from 'src/config';
import { LoggerService } from 'src/log';

export class FastifyService implements ModuleLifecycle {
  private instance: FastifyInstance | undefined;
  public get app(): FastifyInstance {
    return this.instance!;
  }

  constructor(
    readonly logger: LoggerService,
    readonly appConfigService: AppConfigService,
  ) {
    this.instance = fastify({
      logger: {
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
        level: appConfigService.config.logger.level,
      },
      genReqId: () => randomUUID(),
      disableRequestLogging: process.env.LOG_FASTIFY_REQUEST !== 'true',
    });
  }

  async onInit(): Promise<void> {
    // await for OTEL instrumentation, see: https://github.com/fastify/otel?tab=readme-ov-file#automatic-plugin-registration
    await this.instance;
    this.app
      .register(fastifyRequestContext)
      .withTypeProvider<TypeBoxTypeProvider>()
      .addHook('onRequest', (req, reply, done) => {
        req.requestContext.set('logger', req.log);
        done();
      })
      .addHook('onClose', async () => {
        this.logger.info('Web server is shutting down');
      });

    this.registerCORS();
    this.replaceLogger();

    setErrorHandler(this.app as ReturnType<typeof fastify>, this.logger);
    setGeneralResponseHook(this.app, ['/v1', '/v2']);

    if (this.isDev) {
      await this.registerSwagger();
    }
  }

  private get isDev(): boolean {
    return [AppEnvsEnum.DEV, AppEnvsEnum.CIT, AppEnvsEnum.QAT].includes(
      this.appConfigService.config.appEnv,
    );
  }

  /** CORS is added for swagger docs to make requests across environments */
  private registerCORS() {
    if (!this.isDev) return;

    this.app.register(cors, {
      methods: ['GET', 'POST', 'HEAD', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    });
  }

  /** LoggerService is initialized with console in beginning, replace to FastifyLogger for better format */
  private replaceLogger() {
    this.logger.unregister(this.logger.consoleLogger);
    this.logger.append(this.app.log);
  }

  private async registerSwagger() {
    const { appName, appDomain } = this.appConfigService.config;
    await this.app.register(fastifySwagger, {
      openapi: {
        info: {
          title: `${appName} APIs`,
          version: process.env.VERSION || '',
        },
        servers: [
          {
            url: appDomain,
          },
        ],
        components: {
          securitySchemes: {
            serviceApiAuth: {
              type: 'apiKey',
              description: 'Service APIs internal signature',
              name: 'x-signature',
              in: 'header',
            },
          },
        },
      },
    });

    await this.app.register(fastifySwaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        persistAuthorization: true,
      },
    });
  }

  async onStart(): Promise<void> {
    await this.app.listen({
      port: this.appConfigService.config.port,
      host: '::',
    });
  }

  async onDispose(): Promise<void> {
    await this.app.close();
  }
}
