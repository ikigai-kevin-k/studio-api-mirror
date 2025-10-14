import { CacheConnectParams } from '@ikigaians/cache';
import { AppEnvsEnum } from '@ikigaians/common';
import { LogLevelsEnum } from '@ikigaians/logger';
import { KafkaQueueServiceConfig } from '@ikigaians/queue';
import dotenv from 'dotenv';
import {
  AppConfig,
  AuthConfig,
  DbConfig,
  GlobalQueueConfig,
  MasterDbConfig,
} from './app-config.types';

export class AppConfigService {
  constructor() {
    dotenv.config();

    this.logger = {
      level: process.env.LOG_LEVEL as LogLevelsEnum,
    };

    this.auth = { serviceApiSignature: String(process.env.SERVICE_API_SIGNATURE) };

    this.app = {
      port: Number(process.env.PORT) || 80,
      appName: String(process.env.APP_NAME),
      appDomain: process.env.APP_DOMAIN || `http://localhost:${Number(process.env.PORT) || 80}`,
      appEnv: process.env.APP_ENV as AppEnvsEnum,
      logger: this.logger,
    };

    this.db = {
      master: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: process.env.DB_SSL === 'true',
      },
      slaves: [
        {
          host: process.env.DB_SLAVE_HOST,
          port: Number(process.env.DB_SLAVE_PORT),
          username: process.env.DB_SLAVE_USER,
          password: process.env.DB_SLAVE_PASSWORD,
          database: process.env.DB_NAME,
        },
      ],
      logger: this.logger,
    };

    this.cache = {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT),
      password: String(process.env.REDIS_PASSWORD),
      username: String(process.env.REDIS_USERNAME),
      tls: Number(process.env.REDIS_TLS) === 1 || process.env.REDIS_TLS === 'true' || false,
      isCluster:
        Number(process.env.REDIS_IS_CLUSTER) === 1 ||
        process.env.REDIS_IS_CLUSTER === 'true' ||
        false,
    };

    this.queue = {
      hostnames: (process.env.QUEUE_HOST_NAMES || '').split(','),
      protocol: process.env.QUEUE_PROTOCOL as 'AWS' | 'AWSPassword' | 'local',
      region: process.env.APP_CLOUD_REGION || '',
      drRegion: process.env.APP_CLOUD_DR_REGION || '',
      clientId: process.env.APP_NAME || '',
      username: process.env.QUEUE_PROTOCOL === 'AWSPassword' ? process.env.QUEUE_USER : undefined,
      password:
        process.env.QUEUE_PROTOCOL === 'AWSPassword' ? process.env.QUEUE_PASSWORD : undefined,
    };

    this.globalQueue = {
      hostnames: (process.env.GLOBAL_QUEUE_HOST_NAMES || '').split(','),
      protocol: process.env.GLOBAL_QUEUE_PROTOCOL as 'AWS' | 'AWSPassword' | 'local',
      region: process.env.APP_CLOUD_CORE_REGION || 'local',
      drRegion: process.env.APP_CLOUD_DR_CORE_REGION || '',
      clientId: process.env.APP_NAME || '',
      username: process.env.GLOBAL_QUEUE_USER,
      password: process.env.GLOBAL_QUEUE_PASSWORD,
    };

    this.ws = {
      port: Number(process.env.WS_PORT),
      token: String(process.env.WS_TOKEN),
    };

    this.tableApi = {
      url: String(process.env.TABLE_API_SERVICE_URL),
      maxRetry: Number(process.env.TABLE_API_MAX_RETRY),
    };

    this.slack = {
      token: String(process.env.SLACK_STUDIO_TOKEN),
      channel: String(process.env.SLACK_STUDIO_CHANNEL_ID),
    };
  }

  private logger: { level: LogLevelsEnum };

  /** app config */
  private app!: AppConfig;
  get config(): AppConfig {
    return this.app;
  }

  /** auth config */
  private auth: AuthConfig;
  get authConfig(): AuthConfig {
    return this.auth;
  }
  /** db config */
  private db!: { master: MasterDbConfig; slaves: DbConfig[]; logger: { level: LogLevelsEnum } };
  get dbConfig(): { master: MasterDbConfig; slaves: DbConfig[]; logger: { level: LogLevelsEnum } } {
    return this.db;
  }

  private cache: CacheConnectParams;
  get cacheConfig(): CacheConnectParams {
    return this.cache;
  }

  /** queue config */
  private queue!: KafkaQueueServiceConfig;
  get queueConfig(): KafkaQueueServiceConfig {
    return this.queue;
  }

  /** global queue config */
  private globalQueue!: GlobalQueueConfig;
  get globalQueueConfig(): GlobalQueueConfig {
    return this.globalQueue;
  }

  /** ws config */
  private ws!: { port: number; token: string };
  get wsConfig(): { port: number; token: string } {
    return this.ws;
  }

  /** table api url config */
  private tableApi!: { url: string; maxRetry: number };
  get tableApiConfig(): { url: string; maxRetry: number } {
    return this.tableApi;
  }

  /** slack config */
  private slack!: { token: string; channel: string };
  get slackConfig(): { token: string; channel: string } {
    return this.slack;
  }
}
