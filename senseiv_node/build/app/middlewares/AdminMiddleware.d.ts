import { FastifyReply, FastifyRequest } from "fastify";
export declare const AdminMiddleware: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
export declare const ClientMiddleware: (request: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
