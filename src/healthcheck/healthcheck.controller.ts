import { RespSchema } from '@ikigaians/common';
import { ModuleLifecycle } from '@ikigaians/mod';
import { UnauthorizedResponse } from '@ikigaians/web';
import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { PreHandlersService, RouterService } from 'src/router';
import { Healthcheck, HealthcheckType } from './healthcheck.dto';
import { RoutesEnum } from './healthcheck.enum';
import { HealthcheckService } from './healthcheck.service';

export class HealthcheckController implements ModuleLifecycle {
  constructor(
    private readonly preHandlersService: PreHandlersService,
    private readonly healthcheckService: HealthcheckService,
    private readonly routerService: RouterService,
  ) {}

  async onInit(): Promise<void> {
    this.routerService.app.register(async (context) => {
      this.getStatus(context);
    });
  }

  getStatus(app: FastifyInstance) {
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
      },
      async (): Promise<HealthcheckType> => {
        return await this.healthcheckService.getStatus();
      },
    );
  }
}
