import { RespSchema } from '@ikigaians/common';
import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { BadRequestResponse, UnauthorizedResponse } from '@ikigaians/web';
import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { RoutesEnum } from 'src/global/enums/route.enum';
import { PreHandlersService, RouterService } from 'src/router';
import { StudioCdnService } from 'src/studio/services/studio-cdn/studio-cdn.service';
import { StudioGameService } from 'src/studio/services/studio-game/studio-game.service';
import { TableApiForwardService } from 'src/table-api/services/table-api-forward/table-api-forward.service';
import {
  GetStudioTableCdnRequest,
  GetStudioTableCdnRequestType,
  GetStudioTableCdnResponse,
  GetStudioTableCdnResponseType,
  GetStudioTableStreamRequest,
  GetStudioTableStreamRequestType,
  GetStudioTableStreamResponse,
  GetStudioTableStreamResponseType,
  InsertStudioTableStreamRequest,
  InsertStudioTableStreamRequestType,
  InsertStudioTableStreamResponse,
  InsertStudioTableStreamResponseType,
  UpdateStudioTableStreamRequest,
  UpdateStudioTableStreamRequestType,
  UpdateStudioTableStreamResponse,
  UpdateStudioTableStreamResponseType,
} from './studio-cdn.type';

export class StudioCdnController implements ModuleLifecycle {
  constructor(
    private readonly studioGameService: StudioGameService,
    private readonly studioCdnService: StudioCdnService,
    private readonly tableApiForwardService: TableApiForwardService,
    private readonly preHandlersService: PreHandlersService,
    private readonly routerService: RouterService,
    private readonly logger: LoggerService,
  ) {}

  async onInit(): Promise<void> {
    this.routerService.app.register(async (context) => {
      this.getGameCdn(context);
      this.getTableStream(context);
      this.insertTableStream(context);
      this.updateTableStream(context);
    });
  }

  getGameCdn(app: FastifyInstance) {
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
        const game = await this.studioGameService.getGame({ gameId: req.query.tableId });
        const { tableId, cdnDst } = await this.studioCdnService.getTableCdn({
          tableId: game.currentTableId,
        });
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

  getTableStream(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.get<{ Querystring: GetStudioTableStreamRequestType }>(
      RoutesEnum.V1_STUDIO_TABLE_STREAM,
      {
        schema: {
          querystring: GetStudioTableStreamRequest,
          response: {
            [StatusCodes.OK]: RespSchema.Ok(GetStudioTableStreamResponse),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
            [StatusCodes.BAD_REQUEST]: BadRequestResponse,
          },
          tags: ['studio'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (req): Promise<GetStudioTableStreamResponseType> => {
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

  insertTableStream(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.post<{ Body: InsertStudioTableStreamRequestType }>(
      RoutesEnum.V1_STUDIO_TABLE_STREAM,
      {
        schema: {
          body: InsertStudioTableStreamRequest,
          response: {
            [StatusCodes.OK]: RespSchema.Ok(InsertStudioTableStreamResponse),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
            [StatusCodes.BAD_REQUEST]: BadRequestResponse,
          },
          tags: ['studio'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (req): Promise<InsertStudioTableStreamResponseType> => {
        const { tableId, cdnDst } = await this.studioCdnService.insertTableCdn(req.body);
        const output = {
          tableId: tableId,
          cdnDst: {
            primary: cdnDst['primary'],
            secondary: cdnDst['secondary'],
          },
        };

        await this.tableApiForwardService.forwardCDN(output.tableId, output.cdnDst);
        return output;
      },
    );
  }

  updateTableStream(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.patch<{ Body: UpdateStudioTableStreamRequestType }>(
      RoutesEnum.V1_STUDIO_TABLE_STREAM,
      {
        schema: {
          body: UpdateStudioTableStreamRequest,
          response: {
            [StatusCodes.OK]: RespSchema.Ok(UpdateStudioTableStreamResponse),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
            [StatusCodes.BAD_REQUEST]: BadRequestResponse,
          },
          tags: ['studio'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (req): Promise<UpdateStudioTableStreamResponseType> => {
        const { tableId, cdnDst } = await this.studioCdnService.updateTableCdn(req.body);
        const output = {
          tableId: tableId,
          cdnDst: {
            primary: cdnDst['primary'],
            secondary: cdnDst['secondary'],
          },
        };

        await this.tableApiForwardService.forwardCDN(output.tableId, output.cdnDst);
        return output;
      },
    );
  }
}
