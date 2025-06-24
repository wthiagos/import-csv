import { FastifyRequest, FastifyReply } from "fastify";
import { MultipartFile } from '@fastify/multipart';
import { ExcelUploadBody } from "../../schemas/ExcelUploadSchema.js";
import { excelService } from "../../services/excelService.js";
import { V6DTO } from "../../dtos/layouts/v6/index.js";

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

    const records = excelService(
        buffer, {
        sheetsToIgnore: ignored,  // CORRECT
        headerLine: headerLine?.value,
        ignoreLastLine: ignoreLastLine?.value
    });

    reply.status(200).send(records);
};