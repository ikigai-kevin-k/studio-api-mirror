import fastifyWebsocket, { WebSocket } from '@fastify/websocket';
import { ModuleLifecycle } from '@ikigaians/mod';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { RoutesEnum } from 'src/global/enums/route.enum';
import { LoggerService } from 'src/log';
import { RouterService } from 'src/router';
import { WsService } from './ws.service';

export class WsController implements ModuleLifecycle {
  constructor(
    private readonly wsService: WsService,
    private readonly routerService: RouterService,
    private readonly logger: LoggerService,
  ) {}

  async onInit(): Promise<void> {
    this.routerService.app.register(fastifyWebsocket);
    this.routerService.app.register(async (context) => {
      this.connect(context);
    });
  }

  connect(app: FastifyInstance) {
    return app.get(
      RoutesEnum.V1_WS_CONNECT,
      {
        schema: {
          summary: 'Verifies session validity and creates a WebSocket connection',
          tags: ['ws'],
        },
        websocket: true,
      },
      async (ws: WebSocket, req: FastifyRequest) => {
        const query = new URL(req.url!, `http://${req.headers.host}`).searchParams;
        this.wsService.handleConnect(ws, query);
      },
    );
  }
}
