import {FastifyJwtNamespace} from "@fastify/jwt";
import User from "../app/models/User";

type JwtRequest = import('fastify').FastifyRequest<{
    user: User
}> & FastifyJwtNamespace