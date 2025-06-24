import { FastifyInstance } from "fastify";
import { filesRoutes } from "./files/index.js";

export const routes = async (app: FastifyInstance) => {
    app.register(filesRoutes, {
        prefix: 'files'
    })
}