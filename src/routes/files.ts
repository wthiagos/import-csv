import {readFileStream} from "../utils/read-file-stream";
import {FastifyInstance} from "fastify";

export async function filesRoutes(app: FastifyInstance) {
    app.post('/excel', async function handler(req, reply) {
        const data = await req.file();
        
        if (!data)
            throw Error('No file sended!');

        const buffer = await data.toBuffer()

        const records = readFileStream(buffer);

        return reply
            .status(200)
            .send(records)
    });
}