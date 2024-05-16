import {FastifyReply, FastifyRequest} from "fastify";
import User from "../models/User";
import {adminEmail} from "../helpers/helpers";

export const AdminMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const token = (request.headers.authorization as string || '').replace('Bearer ', '')
        if (!token) {
            throw new Error('Authentication error');
        }

        const user = await User.findActiveByToken(token)
        if (!user) {
            throw new Error('Authentication error');
        }

        if (user.email !== adminEmail) {
            throw new Error('Authentication error');
        }

        // @ts-ignore
        request.user = user
    } catch (err) {
        reply.send(err)
    }

    // Go ahead
}

export const ClientMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const token = (request.headers.authorization as string || '').replace('Bearer ', '')
        if (!token) {
            throw new Error('Authentication error');
        }

        const user = await User.findActiveByToken(token)
        if (!user) {
            throw new Error('Authentication error');
        }

        // @ts-ignore
        request.user = user
    } catch (err) {
        return reply.send(err)
    }
}