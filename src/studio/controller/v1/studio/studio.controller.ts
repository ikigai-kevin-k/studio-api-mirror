import { RespSchema } from '@ikigaians/common';
import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { BadRequestResponse, UnauthorizedResponse } from '@ikigaians/web';
import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { PreHandlersService, RouterService } from 'src/router';
import { RoutesEnum } from 'src/studio/enums/studio.router.enum';
import { StudioService } from 'src/studio/services/studio/studio.service';
import {
  GetStudioTableRequest,
  GetStudioTableRequestType,
  GetStudioTableResponse,
  GetStudioTableResponseType,
  UpsertStudioTableRequest,
  UpsertStudioTableRequestType,
  UpsertStudioTableResponse,
  UpsertStudioTableResponseType,
} from './studio.type';

export class StudioController implements ModuleLifecycle {
  constructor(
    private readonly studioService: StudioService,
    private readonly preHandlersService: PreHandlersService,
    private readonly routerService: RouterService,
    private readonly logger: LoggerService,
  ) {}

  async onInit(): Promise<void> {
    this.routerService.app.register(async (context) => {
      this.getStudioTable(context);
      this.upsertStudioTable(context);
    });
  }

  getStudioTable(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.get<{ Querystring: GetStudioTableRequestType }>(
      RoutesEnum.V1_GET_STUDIO_TABLE,
      {
        schema: {
          querystring: GetStudioTableRequest,
          response: {
            [StatusCodes.OK]: RespSchema.Ok(GetStudioTableResponse),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
            [StatusCodes.BAD_REQUEST]: BadRequestResponse,
          },
          tags: ['studio'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (req): Promise<GetStudioTableResponseType> => {
        return await this.studioService.getStudioTable(req.query);
      },
    );
  }

  upsertStudioTable(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.post<{ Body: UpsertStudioTableRequestType }>(
      RoutesEnum.V1_UPSERT_STUDIO_TABLE,
      {
        schema: {
          body: UpsertStudioTableRequest,
          response: {
            [StatusCodes.OK]: RespSchema.Ok(UpsertStudioTableResponse),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
            [StatusCodes.BAD_REQUEST]: BadRequestResponse,
          },
          tags: ['studio'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (req): Promise<UpsertStudioTableResponseType> => {
        return await this.studioService.upsertStudioTable(req.body);
      },
    );
  }
}
