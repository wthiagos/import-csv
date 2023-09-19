import {readFileStream} from "../../utils/read-file-stream";
import {FastifyReply, FastifyRequest} from "fastify";
import {MultipartFile, MultipartValue} from "@fastify/multipart";
import {csvService} from "../../services/csvService";

interface BodyType {
    csv: MultipartFile;
    sheetsToIgnore?: MultipartValue<string>[];
    headerLine?: MultipartValue<number>;
    ignoreLastLine?: MultipartValue<boolean>;
}

export const csvController = async (req: FastifyRequest<{ Body: BodyType }>, reply: FastifyReply) => {
    const {
        csv,
        headerLine,
        ignoreLastLine
    } = req.body;



    const records = csvService(
        await csv.toBuffer(),
        headerLine?.value,
        ignoreLastLine?.value
    );

    return reply
        .status(200)
        .send(records)
}