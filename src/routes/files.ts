import { FastifyInstance } from "fastify";
import { ExcelUploadSchema } from "../schemas/ExcelUploadSchema.js";
import { ReadExcelController } from "../controllers/files/ReadExcelController.js";

export const filesRoutes = async (app: FastifyInstance): Promise<void> => {
    app.post(
        '/excel',
        {
            schema: {
                consumes: ['multipart/form-data'],
                body: ExcelUploadSchema
            }
        },
        ReadExcelController
    );
};
