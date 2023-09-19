import {FastifyInstance} from "fastify";
import {excelRoutes} from "./excelRoutes";
import {csvRoutes} from "./csvRoutes";

export const filesRoutes = async (app: FastifyInstance) => {
    app.register(excelRoutes);

    app.register(csvRoutes);
}