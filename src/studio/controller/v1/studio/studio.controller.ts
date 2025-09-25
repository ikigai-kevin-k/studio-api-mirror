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
  InsertStudioTableRequest,
  InsertStudioTableRequestType,
  InsertStudioTableResponse,
  InsertStudioTableResponseType,
  UpdateStudioTableStatusRequest,
  UpdateStudioTableStatusRequestType,
  UpdateStudioTableStatusResponse,
  UpdateStudioTableStatusResponseType,
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
      this.insertStudioTable(context);
      this.updateStudioTableStatus(context);
    });
  }

  getStudioTable(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.get<{ Querystring: GetStudioTableRequestType }>(
      RoutesEnum.V1_STUDIO_TABLE,
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

  insertStudioTable(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.post<{ Body: InsertStudioTableRequestType }>(
      RoutesEnum.V1_STUDIO_TABLE,
      {
        schema: {
          body: InsertStudioTableRequest,
          response: {
            [StatusCodes.OK]: RespSchema.Ok(InsertStudioTableResponse),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
            [StatusCodes.BAD_REQUEST]: BadRequestResponse,
          },
          tags: ['studio'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (req): Promise<InsertStudioTableResponseType> => {
        return await this.studioService.insertStudioTable(req.body);
      },
    );
  }

  updateStudioTableStatus(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.patch<{ Body: UpdateStudioTableStatusRequestType }>(
      RoutesEnum.V1_STUDIO_TABLE,
      {
        schema: {
          body: UpdateStudioTableStatusRequest,
          response: {
            [StatusCodes.OK]: RespSchema.Ok(UpdateStudioTableStatusResponse),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
            [StatusCodes.BAD_REQUEST]: BadRequestResponse,
          },
          tags: ['studio'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (req): Promise<UpdateStudioTableStatusResponseType> => {
        return await this.studioService.updateStudioTable(req.body);
      },
    );
  }
}
