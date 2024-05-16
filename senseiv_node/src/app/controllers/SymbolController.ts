import {FastifyReply, FastifyRequest} from "fastify";
import {jsonResponse} from "../helpers/helpers";
import Symbol from "../models/Symbol";
import {SymbolAlertRequest} from "../../types/requests/symbol";
import SymbolAlert from "../models/SymbolAlert";

class SymbolController {
    static async getSymbols(req: FastifyRequest, res: FastifyReply) {
        // let symbols: Dictionary = {};
        const response = await Symbol.findAll({
            where: {isActive: true},
            attributes: ['id', 'name', 'current_ce_symbol', 'current_pe_symbol'],
            order: [['id', 'ASC']]
        })
        // for (const responseKey in response) {
        //     const symbol = response[responseKey]
        //     symbols[symbol.name] = symbol
        // }

        return jsonResponse(response)
    }

    static async getAlerts(request: SymbolAlertRequest, reply: FastifyReply) {
        const CEAlerts = await SymbolAlert.findAll(
            {
                where: Object.assign({optionType: 'CE'}, request.params.symbol ? {symbol: request.params.symbol} : {}),
                order: [['id', 'DESC']],
                limit: 20
            }
        )

        const PEAlerts = await SymbolAlert.findAll(
            {
                where: Object.assign({optionType: 'PE'}, request.params.symbol ? {symbol: request.params.symbol} : {}),
                order: [['id', 'DESC']],
                limit: 20
            }
        )

        return jsonResponse({CEAlerts, PEAlerts})
    }

    static async getAlertsHistory(request: SymbolAlertRequest, reply: FastifyReply) {
        let alerts;
        if (request.params.symbol) {
            alerts = await SymbolAlert.findAll({
                where: {symbol: request.params.symbol},
                order: [['id', 'DESC']],
                limit: 20
            })
        } else {
            alerts = await SymbolAlert.findAll({
                order: [['id', 'DESC']],
                limit: 20
            })
        }

        return jsonResponse(alerts)
    }
}

export default SymbolController