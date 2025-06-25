import { FastifyInstance } from "fastify";
import { healthController } from "../../controllers/health/healthController";

export const healthRoutes = async (app: FastifyInstance): Promise<void> => {
    app.get('', healthController);
};
