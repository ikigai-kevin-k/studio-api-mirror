import { AppEnvsEnum } from '@ikigaians/common';
import { LogLevelsEnum } from '@ikigaians/logger';

export type AppConfig = {
  appName: string;
  port: number;
  appDomain: string;
  appEnv: AppEnvsEnum;
  version: string;
  logger: {
    level: LogLevelsEnum;
  };
};

export type AuthConfig = {
  serviceApiSignature: string;
};

export type DbConfig = {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
};

export type MasterDbConfig = DbConfig & {
  ssl: boolean;
};

export type GlobalQueueConfig = {
  hostnames: string[];
  protocol: 'AWS' | 'AWSPassword' | 'local';
  region: string;
  drRegion: string;
  clientId: string;
  username: string | undefined;
  password: string | undefined;
};
