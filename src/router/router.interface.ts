import { FastifyInstance } from 'fastify';

export interface Controller {
  registerRoutes: (app: FastifyInstance) => Promise<void>;
}
