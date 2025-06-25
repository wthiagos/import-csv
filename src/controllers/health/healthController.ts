import { FastifyReply, FastifyRequest } from 'fastify';

export const healthController = async (
    req: FastifyRequest,
    reply: FastifyReply
) => {
    return reply.status(200).send({
        status: 'ok'
    });
};
