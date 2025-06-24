import { FastifyRequest, FastifyReply } from "fastify";
import { MultipartFile } from '@fastify/multipart';
import { readFileStream } from "../../utils/read-file-stream.js";
import { ExcelUploadBody } from "../../schemas/ExcelUploadSchema.js";

export const ReadExcelController = async (
    req: FastifyRequest<{ Body: ExcelUploadBody }>,
    reply: FastifyReply
): Promise<void> => {
    const {
        excel,
        sheetsToIgnore = [],
        headerLine,
        ignoreLastLine
    } = req.body;

    const buffer = await (excel as MultipartFile).toBuffer();

    const ignored = sheetsToIgnore.map(f => f.value);

    const records = readFileStream(
        buffer,
        ignored,
        headerLine?.value,
        ignoreLastLine?.value
    );

    reply.status(200).send(records);
};
