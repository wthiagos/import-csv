import {readFileStream} from "../utils/read-file-stream";
import {FastifyInstance} from "fastify";

export async function excelRoutes (app: FastifyInstance) {
    app.post('/excel', async function handler(req, reply) {
        const data = await req.file();

        if(!data)
            return reply.status(501).send({error: `teste`})

        const buffer = await data.toBuffer()

        const records  = readFileStream(buffer);

        return reply
            .status(200)
            .send(records)
    });
}