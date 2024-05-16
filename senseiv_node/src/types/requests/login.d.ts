import {FastifyRequest} from "fastify";
import {FastifyJwtNamespace} from "@fastify/jwt";

type LoginRequest = FastifyRequest<{
    Body: {
        email: string,
        password: string
    }
}> & FastifyJwtNamespace