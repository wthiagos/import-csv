// controllers/files/csvController.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
import { csvService } from '../../services/csvService.js';

type CsvRequestBody = {
    csv: MultipartFile;
    delimiter?: string;
    headerLine?: number;
    ignoreLastLine?: boolean;
};

export const csvController = async (
    req: FastifyRequest<{ Body: CsvRequestBody }>,
    reply: FastifyReply
) => {
    const {
        csv,
        delimiter = ';',
        headerLine = 0,
        ignoreLastLine = false
    } = req.body;

    const buffer = await csv.toBuffer();

    const records = csvService(buffer, {
        delimiter,
        headerLine,
        ignoreLastLine
    });

    return reply.status(200).send(records);
};
