import {FastifyRequest} from "fastify";

export type TriggerHighSwapRequest = FastifyRequest<{
    Body: { type: string }
}>;

export type SettingUpdateRequest = FastifyRequest<{
    Body: { name: string, value: string }
}>;
