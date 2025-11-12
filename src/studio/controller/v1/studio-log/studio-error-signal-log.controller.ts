import { RespSchema } from '@ikigaians/common';
import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { BadRequestResponse, UnauthorizedResponse } from '@ikigaians/web';
import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { RoutesEnum } from 'src/global/enums/route.enum';
import { PreHandlersService, RouterService } from 'src/router';
import { StudioErrorSignalLogService } from 'src/studio/services/studio-log/studio-error-signal-log.service';
import {
  GetStudioErrorSignalRequest,
  GetStudioErrorSignalRequestType,
  GetStudioErrorSignalResponse,
  GetStudioErrorSignalResponseType,
} from './studio-error-signal-log.controller.type';

export class StudioErrorSignalLogController implements ModuleLifecycle {
  constructor(
    private readonly studioErrorSignalLogService: StudioErrorSignalLogService,
    private readonly preHandlersService: PreHandlersService,
    private readonly routerService: RouterService,
    private readonly logger: LoggerService,
  ) {}

  async onInit(): Promise<void> {
    this.routerService.app.register(async (context) => {
      this.getStudioErrorSignalLog(context);
    });
  }

  getStudioErrorSignalLog(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.get<{ Querystring: GetStudioErrorSignalRequestType }>(
      RoutesEnum.V1_STUDIO_ERROR_SIGNAL_LOG,
      {
        schema: {
          querystring: GetStudioErrorSignalRequest,
          response: {
            [StatusCodes.OK]: RespSchema.Ok(GetStudioErrorSignalResponse),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
            [StatusCodes.BAD_REQUEST]: BadRequestResponse,
          },
          tags: ['studio'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (req): Promise<GetStudioErrorSignalResponseType> => {
        const result = await this.studioErrorSignalLogService.getLogsFromId(req.query);
        return result.map((item) => {
          return {
            ...item,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
          };
        });
      },
    );
  }
}
