import { RespSchema } from '@ikigaians/common';
import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { BadRequestResponse, UnauthorizedResponse } from '@ikigaians/web';
import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { RoutesEnum } from 'src/global/enums/route.enum';
import { PreHandlersService, RouterService } from 'src/router';
import { StudioStatusService } from 'src/studio/services/studio-status/studio-status.service';
import {
  GetTableStatusRequest,
  GetTableStatusRequestType,
  GetTableStatusResponse,
  GetTableStatusResponseType,
  InsertTableStatusRequest,
  InsertTableStatusRequestType,
  InsertTableStatusResponse,
  InsertTableStatusResponseType,
  UpdateTableStatusRequest,
  UpdateTableStatusRequestType,
  UpdateTableStatusResponse,
  UpdateTableStatusResponseType,
} from './studio-status.type';

export class StudioStatusController implements ModuleLifecycle {
  constructor(
    private readonly studioStatusService: StudioStatusService,
    private readonly preHandlersService: PreHandlersService,
    private readonly routerService: RouterService,
    private readonly logger: LoggerService,
  ) {}

  async onInit(): Promise<void> {
    this.routerService.app.register(async (context) => {
      this.getTableStatus(context);
      this.insertTableStatus(context);
      this.updateTableStatus(context);
    });
  }

  getTableStatus(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.get<{ Querystring: GetTableStatusRequestType }>(
      RoutesEnum.V1_STUDIO_TABLE_STATUS,
      {
        schema: {
          querystring: GetTableStatusRequest,
          response: {
            [StatusCodes.OK]: RespSchema.Ok(GetTableStatusResponse),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
            [StatusCodes.BAD_REQUEST]: BadRequestResponse,
          },
          tags: ['studio'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (req): Promise<GetTableStatusResponseType> => {
        const output = await this.studioStatusService.getTableStatus(req.query);
        return output as GetTableStatusResponseType;
      },
    );
  }

  insertTableStatus(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.post<{ Body: InsertTableStatusRequestType }>(
      RoutesEnum.V1_STUDIO_TABLE_STATUS,
      {
        schema: {
          body: InsertTableStatusRequest,
          response: {
            [StatusCodes.OK]: RespSchema.Ok(InsertTableStatusResponse),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
            [StatusCodes.BAD_REQUEST]: BadRequestResponse,
          },
          tags: ['studio'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (req): Promise<InsertTableStatusResponseType> => {
        const output = await this.studioStatusService.insertTableStatus(req.body);
        return output as InsertTableStatusResponseType;
      },
    );
  }

  updateTableStatus(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.patch<{ Body: UpdateTableStatusRequestType }>(
      RoutesEnum.V1_STUDIO_TABLE_STATUS,
      {
        schema: {
          body: UpdateTableStatusRequest,
          response: {
            [StatusCodes.OK]: RespSchema.Ok(UpdateTableStatusResponse),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
            [StatusCodes.BAD_REQUEST]: BadRequestResponse,
          },
          tags: ['studio'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (req): Promise<UpdateTableStatusResponseType> => {
        const output = await this.studioStatusService.updateTableStatus(req.body);
        return output as UpdateTableStatusResponseType;
      },
    );
  }
}
