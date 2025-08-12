/* eslint-disable @typescript-eslint/no-unused-vars */
import { ServiceAuthStrategyService } from '@ikigaians/auth';
import { IkiError } from '@ikigaians/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { LoggerService } from 'src/log';

export class PreHandlersService {
  constructor(
    private readonly logger: LoggerService,
    private readonly serviceAuthStrategyService: ServiceAuthStrategyService,
  ) {}

  async serviceApisAuthenticator({ headers, url }: FastifyRequest, reply: FastifyReply) {
    const signature = headers['x-signature'];

    if (!signature || !this.serviceAuthStrategyService.validateSignature(String(signature))) {
      this.logger.info(`PreHandler: serviceApisAuthenticator for ${url} FAILED`);
      throw new IkiError(`PreHandler: serviceApisAuthenticator for ${url} FAILED`);
    }

    this.logger.debug(`PreHandler: serviceApisAuthenticator for ${url} SUCCESS`);
  }
}
