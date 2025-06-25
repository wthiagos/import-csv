import { FastifyInstance } from "fastify";
import { filesRoutes } from "./files/index.js";
import { healthRoutes } from "./health/index.js";

export const routes = async (app: FastifyInstance) => {
    app.register(filesRoutes, {
        prefix: 'files'
    })

    app.register(healthRoutes, {
        prefix: 'health'
    })
}