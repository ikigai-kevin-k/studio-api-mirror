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
import {
  GetStudioTableCdnRequest,
  GetStudioTableCdnRequestType,
  GetStudioTableCdnResponse,
  GetStudioTableCdnResponseType,
} from './studio-cdn.controller.type';

export class StudioCdnController_V2 implements ModuleLifecycle {
  constructor(
    private readonly studioGameService: StudioGameService,
    private readonly studioCdnService: StudioCdnService,
    private readonly preHandlersService: PreHandlersService,
    private readonly routerService: RouterService,
    private readonly logger: LoggerService,
  ) {}

  async onInit(): Promise<void> {
    this.routerService.app.register(async (context) => {
      this.getGameCdn(context);
    });
  }

  getGameCdn(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.get<{ Querystring: GetStudioTableCdnRequestType }>(
      RoutesEnum.V2_STUDIO_TABLE_CDN,
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
        const game = await this.studioGameService.getGame(req.query);
        const { cdnDst } = await this.studioCdnService.getTableCdn({
          tableId: game.currentTableId,
        });
        return {
          physicalTableCode: req.query.physicalTableCode,
          cdnDst: {
            primary: cdnDst['primary'],
            secondary: cdnDst['secondary'],
          },
        };
      },
    );
  }
}
