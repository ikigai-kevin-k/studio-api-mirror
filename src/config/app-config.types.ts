import { AppEnvsEnum } from '@ikigaians/common';
import { LogLevelsEnum } from '@ikigaians/logger';

export type AppConfig = {
  appName: string;
  port: number;
  appDomain: string;
  appEnv: AppEnvsEnum;
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
  user?: string;
  password?: string;
};

export type MasterDbConfig = DbConfig & {
  dbName?: string;
  ssl: boolean;
};
