import { FastifyReply, FastifyRequest } from "fastify";
import { SymbolAlertRequest } from "../../types/requests/symbol";
declare class SymbolController {
    static getSymbols(req: FastifyRequest, res: FastifyReply): Promise<{
        success: boolean;
        message: string;
        data: object | null;
        code: string;
    }>;
    static getAlerts(request: SymbolAlertRequest, reply: FastifyReply): Promise<{
        success: boolean;
        message: string;
        data: object | null;
        code: string;
    }>;
    static getAlertsHistory(request: SymbolAlertRequest, reply: FastifyReply): Promise<{
        success: boolean;
        message: string;
        data: object | null;
        code: string;
    }>;
}
export default SymbolController;
