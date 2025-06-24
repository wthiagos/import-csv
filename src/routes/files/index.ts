import { FastifyInstance } from "fastify";
import { excelRoutes } from "./excelRoutes.js";
import { csvRoutes } from "./csvRoutes.js";

export const filesRoutes = async (app: FastifyInstance) => {
    app.register(excelRoutes);

    app.register(csvRoutes);
}