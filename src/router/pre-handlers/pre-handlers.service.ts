import { AuthErrorsEnum, ServiceAuthStrategyService } from '@ikigaians/auth';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
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
      reply
        .code(StatusCodes.UNAUTHORIZED)
        .send({ code: AuthErrorsEnum.UNAUTHORIZED_ERROR, message: 'Unauthorized' });
      return;
    }

    this.logger.debug(`PreHandler: serviceApisAuthenticator for ${url} SUCCESS`);
  }
}
