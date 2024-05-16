import {FastifyRequest} from "fastify";

type CreateUserRequest = FastifyRequest<{
    Body: {
        name: string,
        email: string,
        password: string,
        isActive: string,
        expiresAt: string,
    }
}>

type UpdateUserRequest = FastifyRequest<{
    Body: {
        name?: string,
        email?: string,
        password?: string,
        isActive?: string,
        expiresAt?: string,
    },
    Params: { id: string }
}>