import {FastifyRequest} from "fastify";

type SymbolAlertRequest = FastifyRequest<{
    Params: {
        symbol: string
    }
}>