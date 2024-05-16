"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers/helpers");
const Symbol_1 = __importDefault(require("../models/Symbol"));
const SymbolAlert_1 = __importDefault(require("../models/SymbolAlert"));
class SymbolController {
    static async getSymbols(req, res) {
        // let symbols: Dictionary = {};
        const response = await Symbol_1.default.findAll({
            where: { isActive: true },
            attributes: ['id', 'name', 'current_ce_symbol', 'current_pe_symbol'],
            order: [['id', 'ASC']]
        });
        // for (const responseKey in response) {
        //     const symbol = response[responseKey]
        //     symbols[symbol.name] = symbol
        // }
        return (0, helpers_1.jsonResponse)(response);
    }
    static async getAlerts(request, reply) {
        const CEAlerts = await SymbolAlert_1.default.findAll({
            where: Object.assign({ optionType: 'CE' }, request.params.symbol ? { symbol: request.params.symbol } : {}),
            order: [['id', 'DESC']],
            limit: 20
        });
        const PEAlerts = await SymbolAlert_1.default.findAll({
            where: Object.assign({ optionType: 'PE' }, request.params.symbol ? { symbol: request.params.symbol } : {}),
            order: [['id', 'DESC']],
            limit: 20
        });
        return (0, helpers_1.jsonResponse)({ CEAlerts, PEAlerts });
    }
    static async getAlertsHistory(request, reply) {
        let alerts;
        if (request.params.symbol) {
            alerts = await SymbolAlert_1.default.findAll({
                where: { symbol: request.params.symbol },
                order: [['id', 'DESC']],
                limit: 20
            });
        }
        else {
            alerts = await SymbolAlert_1.default.findAll({
                order: [['id', 'DESC']],
                limit: 20
            });
        }
        return (0, helpers_1.jsonResponse)(alerts);
    }
}
exports.default = SymbolController;
