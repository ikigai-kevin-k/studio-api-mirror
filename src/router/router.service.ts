import { ModuleLifecycle } from '@ikigaians/mod';
import { HealthcheckController } from 'src/healthcheck';
import { FastifyService } from './fastify.service';
import { Controller } from './router.interface';

export class RouterService implements ModuleLifecycle {
  private controllers: Controller[] = [];

  constructor(
    private readonly fastifyService: FastifyService,
    private readonly healthcheckController: HealthcheckController,
  ) {
    this.controllers.push(this.healthcheckController);
  }

  async onInit() {
    this.fastifyService.app.addHook('onRoute', async (opts) => {
      this.fastifyService.app.log?.info(`[fastify] router added: ${opts.url}`);
    });

    for (const controller of this.controllers) {
      controller.registerRoutes(this.fastifyService.app);
    }
  }
}
