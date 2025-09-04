import { CacheConnectParams } from '@ikigaians/cache';
import { AppEnvsEnum } from '@ikigaians/common';
import { LogLevelsEnum } from '@ikigaians/logger';
import dotenv from 'dotenv';
import { AppConfig, AuthConfig, DbConfig, MasterDbConfig } from './app-config.types';

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

    this.jobLocker = {
      host: process.env.JOB_LOCKER_HOST || 'localhost',
      port: Number(process.env.JOB_LOCKER_PORT),
      password: String(process.env.JOB_LOCKER_PASSWORD),
      username: String(process.env.JOB_LOCKER_USERNAME),
      tls:
        Number(process.env.JOB_LOCKER_TLS) === 1 || process.env.JOB_LOCKER_TLS === 'true' || false,
    };

    this.ws = {
      port: Number(process.env.WS_PORT),
      token: String(process.env.WS_TOKEN),
    };

    this.los = {
      url: String(process.env.LOS_SERVICE_URL),
    };

    this.am = {
      url: String(process.env.AM_SERVICE_URL),
      user: String(process.env.AM_STUDIO_USER),
      pw: String(process.env.AM_STUDIO_PASSWORD),
    };

    this.slack = {
      token: String(process.env.SLACK_TOKEN),
      channel: String(process.env.SLACK_CHANNEL_ID),
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

  /** jobLocker config */
  private jobLocker!: {
    host: string;
    port: number;
    username: string;
    password: string;
    tls: boolean;
  };
  get jobLockerConfig(): {
    host: string;
    port: number;
    username: string;
    password: string;
    tls: boolean;
  } {
    return this.jobLocker;
  }

  /** ws config */
  private ws!: { port: number; token: string };
  get wsConfig(): { port: number; token: string } {
    return this.ws;
  }

  /** los url config */
  private los!: { url: string };
  get losConfig(): { url: string } {
    return this.los;
  }

  /** access manager config */
  private am!: { url: string; user: string; pw: string };
  get amConfig(): { url: string; user: string; pw: string } {
    return this.am;
  }

  /** slack config */
  private slack!: { token: string; channel: string };
  get slackConfig(): { token: string; channel: string } {
    return this.slack;
  }
}
