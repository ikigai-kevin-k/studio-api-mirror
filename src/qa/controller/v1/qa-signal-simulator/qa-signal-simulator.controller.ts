import { RespSchema } from '@ikigaians/common';
import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { BadRequestResponse, UnauthorizedResponse } from '@ikigaians/web';
import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { RoutesEnum } from 'src/global/enums/route.enum';
import { PreHandlersService, RouterService } from 'src/router';
import { StudioCdnService } from 'src/studio/services/studio-cdn/studio-cdn.service';
import { StudioDeviceDataService } from 'src/studio/services/studio-device/studio-device-data.service';
import { StudioService } from 'src/studio/services/studio/studio.service';
import { TableApiSignalService } from 'src/table-api/services/table-api-signal/table-api-signal.service';
import {
  ErrorSignalBody,
  ErrorSignalParams,
  ErrorSignalRequestType,
  TableApiErrorSignalResponse,
  TableApiErrorSignalResponseType,
} from './qa-signal-simulator.controller.type';

export class QaSignalSimulatorController implements ModuleLifecycle {
  constructor(
    private readonly studioService: StudioService,
    private readonly studioDeviceDataService: StudioDeviceDataService,
    private readonly studioCdnService: StudioCdnService,
    private readonly tableApiSignalService: TableApiSignalService,
    private readonly preHandlersService: PreHandlersService,
    private readonly routerService: RouterService,
    private readonly logger: LoggerService,
  ) {}

  async onInit(): Promise<void> {
    this.routerService.app.register(async (context) => {
      this.postTableApiErrorSignal(context);
    });
  }

  postTableApiErrorSignal(app: FastifyInstance) {
    const serviceAuth = this.preHandlersService.serviceApisAuthenticator.bind(
      this.preHandlersService,
    );

    return app.post<ErrorSignalRequestType>(
      RoutesEnum.V1_QA_SIMULATE_TABLE_API_ERROR_SIGNAL,
      {
        schema: {
          params: ErrorSignalParams,
          body: ErrorSignalBody,
          response: {
            [StatusCodes.OK]: RespSchema.Ok(TableApiErrorSignalResponse),
            [StatusCodes.UNAUTHORIZED]: UnauthorizedResponse,
            [StatusCodes.BAD_REQUEST]: BadRequestResponse,
          },
          tags: ['qa simulator'],
          security: [{ serviceApiAuth: [] }],
        },
        preHandler: [serviceAuth],
      },
      async (req): Promise<TableApiErrorSignalResponseType> => {
        const input = {
          Params: req.params,
          Body: req.body,
        };
        const output = await this.tableApiSignalService.forwardSignal(
          input.Params.gameCode,
          input.Body,
        );
        return {
          table: output.data.table,
        };
      },
    );
  }
}
