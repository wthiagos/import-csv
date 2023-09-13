import {readFileStream} from "../../utils/read-file-stream";
import {FastifyReply, FastifyRequest} from "fastify";
import {MultipartFile, MultipartValue} from "@fastify/multipart";

interface BodyType {
    csv: MultipartFile;
    sheetsToIgnore?: MultipartValue<string>[];
    headerLine?: MultipartValue<number>;
    ignoreLastLine?: MultipartValue<boolean>;
}

export const ReadCsvController = async (req: FastifyRequest<{ Body: BodyType }>, reply: FastifyReply) => {
    const {
        csv,
        sheetsToIgnore: fields,
        headerLine,
        ignoreLastLine
    } = req.body;

    const sheetsToIgnore: string[] = [];

    if (fields) {
        fields
            .forEach((f: MultipartValue<string>) => {
                sheetsToIgnore.push(f.value);
            })
    }

    const records = readFileStream(
        await csv.toBuffer(),
        sheetsToIgnore,
        headerLine?.value,
        ignoreLastLine?.value
    );

    return reply
        .status(200)
        .send(records)
}