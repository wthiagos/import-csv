// app.ts
import Fastify from 'fastify';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import { filesRoutes } from './routes/files/index.js';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { routes } from './routes/index.js';

export const app = Fastify({
    logger: true
}).withTypeProvider<TypeBoxTypeProvider>();

// Rate limit
app.register(rateLimit, {
    max: 2,
    timeWindow: 2 * 1000 // in ms
});

// Multipart handling
app.register(multipart, {
    attachFieldsToBody: true,
    limits: {
        fieldNameSize: 100,   // Max field name size in bytes
        fieldSize: 100,       // Max field value size in bytes
        fields: 10,           // Max number of non-file fields
        fileSize: 1_000_000,  // Max file size: 1MB
        files: 1,             // Max number of file fields
        headerPairs: 2000,
        parts: 1000           // Max total parts (fields + files)
    }
});

// Routes
app.register(routes);

// Error handler
app.setErrorHandler((error, request, reply) => {
    if (error.code === 'FST_ERR_BAD_STATUS_CODE') {
        app.log.error(error);
        return reply.status(500).send({ ok: false });
    }

    if (error.statusCode === 429) {
        error.message = 'You hit the rate limit! Slow down please!';
        return reply.code(429).send(error);
    }

    return reply.send(error);
});