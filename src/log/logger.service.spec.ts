import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('constructor', () => {
    it('should initialize with Console', () => {
      const logger = new LoggerService();
      const loggers = logger['loggers'];
      expect(loggers).toHaveLength(1);
    });
  });
});
