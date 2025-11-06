import { RespSchema } from '@ikigaians/common';
import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { BadRequestResponse, UnauthorizedResponse } from '@ikigaians/web';
import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { RoutesEnum } from 'src/global/enums/route.enum';
import { PreHandlersService, RouterService } from 'src/router';
import { StudioGameService } from 'src/studio/services/studio-game/studio-game.service';
import {
  GetGameRequest,
  GetGameRequestType,
  GetGameResponse,
  GetGameResponseType,
  InsertGameRequest,
  InsertGameRequestType,
  InsertGameResponse,
  InsertGameResponseType,
  UpdateGameRequest,
  UpdateGameRequestType,
  UpdateGameResponse,
  UpdateGameResponseType,
} from './studio-game.controller.type';

export class StudioGameController implements ModuleLifecycle {
  constructor(
    private readonly studioGameService: StudioGameService,
    private readonly preHandlersService: PreHandlersService,
    private readonly routerService: RouterService,
    private readonly logger: LoggerService,
  ) {}

  async onInit(): Promise<void> {
    this.routerService.app.register(async (context) => {
      this.getGame(context);
      this.insertGame(context);
      this.updateGame(context);
    });
  }

  getGame(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.get<{ Querystring: GetGameRequestType }>(
      RoutesEnum.V1_STUDIO_GAME,
      {
        schema: {
          querystring: GetGameRequest,
          response: {
            [StatusCodes.OK]: RespSchema.Ok(GetGameResponse),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
            [StatusCodes.BAD_REQUEST]: BadRequestResponse,
          },
          tags: ['studio'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (req): Promise<GetGameResponseType> => {
        return await this.studioGameService.getGame(req.query);
      },
    );
  }

  insertGame(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.post<{ Body: InsertGameRequestType }>(
      RoutesEnum.V1_STUDIO_GAME,
      {
        schema: {
          body: InsertGameRequest,
          response: {
            [StatusCodes.OK]: RespSchema.Ok(InsertGameResponse),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
            [StatusCodes.BAD_REQUEST]: BadRequestResponse,
          },
          tags: ['studio'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (req): Promise<InsertGameResponseType> => {
        return await this.studioGameService.insertGame(req.body);
      },
    );
  }

  updateGame(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.patch<{ Body: UpdateGameRequestType }>(
      RoutesEnum.V1_STUDIO_GAME,
      {
        schema: {
          body: UpdateGameRequest,
          response: {
            [StatusCodes.OK]: RespSchema.Ok(UpdateGameResponse),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
            [StatusCodes.BAD_REQUEST]: BadRequestResponse,
          },
          tags: ['studio'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (req): Promise<UpdateGameResponseType> => {
        return await this.studioGameService.updateGame(req.body);
      },
    );
  }
}
