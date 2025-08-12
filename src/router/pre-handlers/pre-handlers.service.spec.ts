/* eslint-disable @typescript-eslint/no-explicit-any */

import { ServiceAuthStrategyService } from '@ikigaians/auth';
import { IkiError } from '@ikigaians/common';
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

  it('should throw an IkiError if signature is missing or invalid', async () => {
    (serviceAuthStrategyService.validateSignature as jest.Mock).mockReturnValue(false);

    const request = { headers: {}, url: '/test' } as any;
    const reply = {} as any;

    await expect(preHandlersService.serviceApisAuthenticator(request, reply)).rejects.toThrow(
      IkiError,
    );

    expect(logger.info).toHaveBeenCalledWith(
      `PreHandler: serviceApisAuthenticator for /test FAILED`,
    );
    expect(logger.debug).not.toHaveBeenCalled();
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
  });
});
