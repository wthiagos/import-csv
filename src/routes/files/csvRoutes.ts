import { FastifyInstance } from 'fastify';
import { csvController } from '../../controllers/files/csvController.js';
import { CsvBodySchema } from '../../schemas/CsvBodySchema.js';

export async function csvRoutes(app: FastifyInstance): Promise<void> {
    app.post(
        '/csv',
        {
            schema: {
                consumes: ['multipart/form-data'],
                body: CsvBodySchema
            }
        },
        csvController
    );
}
