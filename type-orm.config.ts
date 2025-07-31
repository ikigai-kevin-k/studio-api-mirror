import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { AppConfigService } from './src/config/app-config.service';

dotenv.config();

const {
  master: { host, port, password, user, dbName, ssl },
} = new AppConfigService().dbConfig;

const sslConfig = ssl
  ? {
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }
  : undefined;

export default new DataSource({
  type: 'postgres',
  host,
  port,
  username: user,
  password,
  database: dbName,
  entities: ['src/**/*.entity.{ts,js}'],
  migrations: ['src/**/migrations/*.{ts,js}'],
  subscribers: ['src/**/subscribers/*.{ts,js}'],
  synchronize: false,
  logging: false,
  ...sslConfig,
});
