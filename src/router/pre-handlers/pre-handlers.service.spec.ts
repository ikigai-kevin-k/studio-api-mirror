/* eslint-disable @typescript-eslint/no-explicit-any */

import { ServiceAuthStrategyService } from '@ikigaians/auth';
import { LoggerService } from 'src/log/logger.service';
import { PreHandlersService } from './pre-handlers.service';

describe('PreHandlersService', () => {
  let logger: LoggerService;
  let serviceAuthStrategyService: ServiceAuthStrategyService;
  let preHandlersService: PreHandlersService;

  beforeEach(() => {
    logger = { info: jest.fn(), debug: jest.fn() } as unknown as LoggerService;
    serviceAuthStrategyService = {
      validateSignature: jest.fn(),
    } as unknown as ServiceAuthStrategyService;
    preHandlersService = new PreHandlersService(logger, serviceAuthStrategyService);
  });

  it('should return unauthorized if signature is missing or invalid', async () => {
    (serviceAuthStrategyService.validateSignature as jest.Mock).mockReturnValue(false);
    const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() };
    await preHandlersService.serviceApisAuthenticator(
      { headers: {}, url: '/test' } as any,
      reply as any,
    );
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('FAILED'));
    expect(reply.code).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('should log success if signature is valid', async () => {
    (serviceAuthStrategyService.validateSignature as jest.Mock).mockReturnValue(true);
    const reply = { code: jest.fn(), send: jest.fn() };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await preHandlersService.serviceApisAuthenticator(
      { headers: { 'x-signature': 'valid' }, url: '/test' } as any,
      reply as any,
    );
    expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('SUCCESS'));
    expect(reply.code).not.toHaveBeenCalled();
    expect(reply.send).not.toHaveBeenCalled();
  });
});
