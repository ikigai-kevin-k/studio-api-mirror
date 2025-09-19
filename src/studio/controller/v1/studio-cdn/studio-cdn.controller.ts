import { RespSchema } from '@ikigaians/common';
import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { BadRequestResponse, UnauthorizedResponse } from '@ikigaians/web';
import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { PreHandlersService, RouterService } from 'src/router';
import { RoutesEnum } from 'src/studio/enums/studio.router.enum';
import { StudioCdnService } from 'src/studio/services/studio-cdn/studio-cdn.service';
import {
  GetStudioTableCdnRequest,
  GetStudioTableCdnRequestType,
  GetStudioTableCdnResponse,
  GetStudioTableCdnResponseType,
  InsertStudioTableCdnRequest,
  InsertStudioTableCdnRequestType,
  InsertStudioTableCdnResponse,
  InsertStudioTableCdnResponseType,
  UpdateStudioTableCdnRequest,
  UpdateStudioTableCdnRequestType,
  UpdateStudioTableCdnResponse,
  UpdateStudioTableCdnResponseType,
} from './studio-cdn.type';

export class StudioCdnController implements ModuleLifecycle {
  constructor(
    private readonly studioCdnService: StudioCdnService,
    private readonly preHandlersService: PreHandlersService,
    private readonly routerService: RouterService,
    private readonly logger: LoggerService,
  ) {}

  async onInit(): Promise<void> {
    this.routerService.app.register(async (context) => {
      this.getTableCdn(context);
      this.insertTableCdn(context);
      this.updateTableCdn(context);
    });
  }

  getTableCdn(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.get<{ Querystring: GetStudioTableCdnRequestType }>(
      RoutesEnum.V1_STUDIO_TABLE_CDN,
      {
        schema: {
          querystring: GetStudioTableCdnRequest,
          response: {
            [StatusCodes.OK]: RespSchema.Ok(GetStudioTableCdnResponse),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
            [StatusCodes.BAD_REQUEST]: BadRequestResponse,
          },
          tags: ['studio'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (req): Promise<GetStudioTableCdnResponseType> => {
        const { tableId, cdnDst } = await this.studioCdnService.getTableCdn(req.query);
        return {
          tableId: tableId,
          cdnDst: {
            primary: cdnDst['primary'],
            secondary: cdnDst['secondary'],
          },
        };
      },
    );
  }

  insertTableCdn(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.post<{ Body: InsertStudioTableCdnRequestType }>(
      RoutesEnum.V1_STUDIO_TABLE_CDN,
      {
        schema: {
          body: InsertStudioTableCdnRequest,
          response: {
            [StatusCodes.OK]: RespSchema.Ok(InsertStudioTableCdnResponse),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
            [StatusCodes.BAD_REQUEST]: BadRequestResponse,
          },
          tags: ['studio'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (req): Promise<InsertStudioTableCdnResponseType> => {
        const { tableId, cdnDst } = await this.studioCdnService.insertTableCdn(req.body);
        const output = {
          tableId: tableId,
          cdnDst: {
            primary: cdnDst['primary'],
            secondary: cdnDst['secondary'],
          },
        };
        return output;
      },
    );
  }

  updateTableCdn(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.patch<{ Body: UpdateStudioTableCdnRequestType }>(
      RoutesEnum.V1_STUDIO_TABLE_CDN,
      {
        schema: {
          body: UpdateStudioTableCdnRequest,
          response: {
            [StatusCodes.OK]: RespSchema.Ok(UpdateStudioTableCdnResponse),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
            [StatusCodes.BAD_REQUEST]: BadRequestResponse,
          },
          tags: ['studio'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (req): Promise<UpdateStudioTableCdnResponseType> => {
        const { tableId, cdnDst } = await this.studioCdnService.updateTableCdn(req.body);
        const output = {
          tableId: tableId,
          cdnDst: {
            primary: cdnDst['primary'],
            secondary: cdnDst['secondary'],
          },
        };
        return output;
      },
    );
  }
}
