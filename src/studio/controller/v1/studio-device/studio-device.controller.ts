import { RespSchema } from '@ikigaians/common';
import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { BadRequestResponse, UnauthorizedResponse } from '@ikigaians/web';
import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { PreHandlersService, RouterService } from 'src/router';
import { RoutesEnum } from 'src/studio/enums/studio.router.enum';
import { StudioDeviceDataService } from 'src/studio/services/studio-device/studio-device-data.service';
import {
  GetDeviceRequest,
  GetDeviceRequestType,
  GetDeviceResponse,
  GetDeviceResponseType,
  InsertDeviceRequest,
  InsertDeviceRequestType,
  InsertDeviceResponse,
  InsertDeviceResponseType,
  UpdateDeviceRequest,
  UpdateDeviceRequestType,
  UpdateDeviceResponse,
  UpdateDeviceResponseType,
} from './studio-device.type';

export class StudioDeviceDataController implements ModuleLifecycle {
  constructor(
    private readonly studioDeviceDataService: StudioDeviceDataService,
    private readonly preHandlersService: PreHandlersService,
    private readonly routerService: RouterService,
    private readonly logger: LoggerService,
  ) {}

  async onInit(): Promise<void> {
    this.routerService.app.register(async (context) => {
      this.getDevice(context);
      this.insertDevice(context);
      this.updateDevice(context);
    });
  }

  getDevice(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.get<{ Querystring: GetDeviceRequestType }>(
      RoutesEnum.V1_STUDIO_DEVICE,
      {
        schema: {
          querystring: GetDeviceRequest,
          response: {
            [StatusCodes.OK]: RespSchema.Ok(GetDeviceResponse),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
            [StatusCodes.BAD_REQUEST]: BadRequestResponse,
          },
          tags: ['device'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (req): Promise<GetDeviceResponseType> => {
        return await this.studioDeviceDataService.getDevice(req.query);
      },
    );
  }

  insertDevice(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.post<{ Body: InsertDeviceRequestType }>(
      RoutesEnum.V1_STUDIO_DEVICE,
      {
        schema: {
          body: InsertDeviceRequest,
          response: {
            [StatusCodes.OK]: RespSchema.Ok(InsertDeviceResponse),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
            [StatusCodes.BAD_REQUEST]: BadRequestResponse,
          },
          tags: ['device'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (req): Promise<InsertDeviceResponseType> => {
        return await this.studioDeviceDataService.insertDevice(req.body);
      },
    );
  }

  updateDevice(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.patch<{ Body: UpdateDeviceRequestType }>(
      RoutesEnum.V1_STUDIO_DEVICE,
      {
        schema: {
          body: UpdateDeviceRequest,
          response: {
            [StatusCodes.OK]: RespSchema.Ok(UpdateDeviceResponse),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
            [StatusCodes.BAD_REQUEST]: BadRequestResponse,
          },
          tags: ['device'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (req): Promise<UpdateDeviceResponseType> => {
        return await this.studioDeviceDataService.updateDevice(req.body);
      },
    );
  }
}
