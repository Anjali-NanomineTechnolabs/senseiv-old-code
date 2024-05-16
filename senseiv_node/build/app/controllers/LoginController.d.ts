import { FastifyReply } from "fastify";
import { LoginRequest } from "../../types/requests/login";
declare class LoginController {
    static login(request: LoginRequest, response: FastifyReply): Promise<{
        success: boolean;
        message: string;
        data: object | null;
        code: string;
    }>;
    static logout(request: LoginRequest, response: FastifyReply): Promise<{
        success: boolean;
        message: string;
        data: object | null;
        code: string;
    }>;
    static verifyToken(request: LoginRequest, response: FastifyReply): {
        success: boolean;
        message: string;
        data: object | null;
        code: string;
    };
}
export default LoginController;
