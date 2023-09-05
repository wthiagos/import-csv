import Fastify, {FastifyError, FastifyInstance, FastifyReply, FastifyRequest} from 'fastify'
import rateLimit from "@fastify/rate-limit";
import multipart from "@fastify/multipart";
import {filesRoutes} from "./routes/files";

export const app: FastifyInstance = Fastify({
    logger: true,
});

app.register(rateLimit, {
    max: 2,
    timeWindow: 2
})

// @ts-ignore
app.register(multipart, {
    attachFieldsToBody: true,
    limits: {
        fieldNameSize: 100, // Max field name size in bytes
        fieldSize: 100,     // Max field value size in bytes
        fields: 10,         // Max number of non-file fields
        fileSize: 1000000,  // For multipart forms, the max file size in bytes
        files: 1,           // Max number of file fields
        headerPairs: 2000,  // Max number of header key=>value pairs
        parts: 1000         // For multipart forms, the max number of parts (fields + files)
    }
});

app.register(filesRoutes, {
    prefix: 'files',
});

app.setErrorHandler(function (error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
    if (error instanceof Fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
        // Log error
        this.log.error(error)

        // Send error response
        reply.status(500).send({ok: false})
    } else if (error.statusCode === 429) {
        reply.code(429)
        error.message = 'You hit the rate limit! Slow down please!'
    }

    reply.send(error)
});

