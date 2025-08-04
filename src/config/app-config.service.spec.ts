import { AppConfigService } from './app-config.service';

describe('AppConfigService', () => {
  let appConfigService: AppConfigService;

  beforeEach(() => {
    process.env.PORT = '3000';
    process.env.APP_NAME = 'test-app';
    process.env.APP_DOMAIN = 'http://localhost:3000';
    process.env.APP_ENV = 'dev';
    process.env.LOG_LEVEL = 'debug';
    process.env.SERVICE_API_SIGNATURE = 'sig';
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = '5432';
    process.env.DB_NAME = 'testdb';
    process.env.DB_USER = 'user';
    process.env.DB_PASSWORD = 'pass';
    process.env.DB_SSL = 'false';
    process.env.REDIS_HOST = 'localhost';
    process.env.REDIS_PORT = '6379';
    process.env.REDIS_PASSWORD = 'redispass';
    process.env.REDIS_USERNAME = 'redisuser';
    process.env.REDIS_TLS = '0';
    process.env.REDIS_IS_CLUSTER = '0';
    process.env.DB_SLAVE_HOST = 'slavehost';
    process.env.DB_SLAVE_PORT = '1234';
    process.env.DB_SLAVE_USER = 'slaveuser';
    process.env.DB_SLAVE_PASSWORD = 'slavepass';
    appConfigService = new AppConfigService();
  });

  it('should instantiate and provide config', () => {
    expect(appConfigService.config.appName).toBe('test-app');
    expect(appConfigService.config.port).toBe(3000);
    expect(appConfigService.config.appDomain).toBe('http://localhost:3000');
    expect(appConfigService.config.logger.level).toBe('debug');
  });

  it('should provide authConfig', () => {
    expect(appConfigService.authConfig.serviceApiSignature).toBe('sig');
  });

  it('should provide dbConfig', () => {
    expect(appConfigService.dbConfig.master.host).toBe('localhost');
    expect(appConfigService.dbConfig.master.port).toBe(5432);
    expect(appConfigService.dbConfig.master.database).toBe('testdb');
    expect(appConfigService.dbConfig.master.username).toBe('user');
    expect(appConfigService.dbConfig.master.password).toBe('pass');
    expect(appConfigService.dbConfig.master.ssl).toBe(false);
  });

  it('should cover slave dbConfig properties', () => {
    appConfigService = new AppConfigService();
    expect(appConfigService.dbConfig).toHaveProperty('master');
    expect(appConfigService.dbConfig).toHaveProperty('slaves');
    expect(appConfigService.dbConfig).toHaveProperty('logger');
    const slave = appConfigService.dbConfig.slaves[0];
    expect(slave.host).toBe('slavehost');
    expect(slave.port).toBe(1234);
    expect(slave.username).toBe('slaveuser');
    expect(slave.password).toBe('slavepass');
  });

  it('should provide cacheConfig', () => {
    expect(appConfigService.cacheConfig.host).toBe('localhost');
    expect(appConfigService.cacheConfig.port).toBe(6379);
    expect(appConfigService.cacheConfig.password).toBe('redispass');
    expect(appConfigService.cacheConfig.username).toBe('redisuser');
    expect(appConfigService.cacheConfig.tls).toBe(false);
    expect(appConfigService.cacheConfig.isCluster).toBe(false);
  });
});
