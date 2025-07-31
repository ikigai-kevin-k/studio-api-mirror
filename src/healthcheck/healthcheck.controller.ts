import { RespSchema } from '@ikigaians/common';
import { UnauthorizedResponse } from '@ikigaians/web';
import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Controller, PreHandlersService, RoutesEnum } from 'src/router';
import { Healthcheck, HealthcheckType } from './healthcheck.dto';
import { HealthcheckService } from './healthcheck.service';

export class HealthcheckController implements Controller {
  constructor(
    private readonly preHandlersService: PreHandlersService,
    private readonly healthcheckService: HealthcheckService,
  ) {}

  async registerRoutes(app: FastifyInstance) {
    app.register(async (context) => {
      this.getStatus(context);
    });
  }

  getStatus(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.get(
      RoutesEnum.V1_HEALTHCHECK,
      {
        schema: {
          response: {
            [StatusCodes.OK]: RespSchema.Ok(Healthcheck),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
          },
          tags: ['service', 'healthcheck'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (): Promise<HealthcheckType> => {
        return await this.healthcheckService.getStatus();
      },
    );
  }
}
