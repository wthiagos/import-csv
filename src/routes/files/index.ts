import {excelRoutes} from "./excel.route";
import {csvRoutes} from "./csv.route";
import {FastifyInstance} from "fastify";

export const filesRoutes = async (app: FastifyInstance) => {
    app.register(excelRoutes);

    app.register(csvRoutes);
}