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
  UpsertStudioTableCdnRequest,
  UpsertStudioTableCdnRequestType,
  UpsertStudioTableCdnResponse,
  UpsertStudioTableCdnResponseType,
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
      this.upsertTableCdn(context);
    });
  }

  getTableCdn(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.post<{ Body: GetStudioTableCdnRequestType }>(
      RoutesEnum.V1_GET_STUDIO_TABLE_CDN,
      {
        schema: {
          body: GetStudioTableCdnRequest,
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
        const { tableId, primary, secondary } = await this.studioCdnService.getTableCdn(req.body);
        return {
          tableId: tableId,
          cdnDST: {
            primary: primary,
            secondary: secondary,
          },
        };
      },
    );
  }

  upsertTableCdn(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.post<{ Body: UpsertStudioTableCdnRequestType }>(
      RoutesEnum.V1_UPSERT_STUDIO_TABLE_CDN,
      {
        schema: {
          body: UpsertStudioTableCdnRequest,
          response: {
            [StatusCodes.OK]: RespSchema.Ok(UpsertStudioTableCdnResponse),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
            [StatusCodes.BAD_REQUEST]: BadRequestResponse,
          },
          tags: ['studio'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (req): Promise<UpsertStudioTableCdnResponseType> => {
        const { tableId, primary, secondary } = await this.studioCdnService.upsertTableCdn(
          req.body,
        );
        return {
          tableId: tableId,
          primary: primary,
          secondary: secondary,
        };
      },
    );
  }
}
