import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserRequest, UpdateUserRequest } from "../../types/requests/user";
declare class UserController {
    static getAll(req: FastifyRequest, res: FastifyReply): Promise<{
        success: boolean;
        message: string;
        data: object | null;
        code: string;
    }>;
    static create({ body }: CreateUserRequest, res: FastifyReply): Promise<{
        success: boolean;
        message: string;
        data: object | null;
        code: string;
    }>;
    static getOne(req: UpdateUserRequest, res: FastifyReply): Promise<{
        success: boolean;
        message: string;
        data: object | null;
        code: string;
    }>;
    static update(req: UpdateUserRequest, res: FastifyReply): Promise<{
        success: boolean;
        message: string;
        data: object | null;
        code: string;
    }>;
    static delete(req: UpdateUserRequest, res: FastifyReply): Promise<{
        success: boolean;
        message: string;
        data: object | null;
        code: string;
    }>;
}
export default UserController;
