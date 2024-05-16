"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const helpers_1 = require("../helpers/helpers");
const SymbolAlert_1 = __importDefault(require("./SymbolAlert"));
class SymbolHigh extends sequelize_1.Model {
    static highTypes = [
        'allTimeHigh', 'threeMonthsHigh', 'twoMonthsHigh', 'monthHigh', 'prevCalendarMonthHigh', 'threeWeekHigh',
        'twoWeekHigh', 'weekHigh', 'threeDaysHigh', 'twoDaysHigh', 'yesterdayHigh', 'todayHigh'
    ];
    async createSymbolAlert(type, price, optionType) {
        return await SymbolAlert_1.default.create({ symbol: this.symbol, period: type, volume: price, optionType });
    }
}
SymbolHigh.init({
    id: helpers_1.idAttribute,
    symbol: { type: sequelize_1.DataTypes.STRING(255), allowNull: false, },
    type: { type: sequelize_1.DataTypes.ENUM('PE', 'CE'), allowNull: false, defaultValue: 'CE' },
    typeSymbol: { type: sequelize_1.DataTypes.STRING(255), allowNull: false, defaultValue: 'symbol' },
    allTimeHigh: { type: sequelize_1.DataTypes.FLOAT, allowNull: false, },
    threeMonthsHigh: { type: sequelize_1.DataTypes.FLOAT, allowNull: false, },
    twoMonthsHigh: { type: sequelize_1.DataTypes.FLOAT, allowNull: false, },
    monthHigh: { type: sequelize_1.DataTypes.FLOAT, allowNull: false, },
    prevCalendarMonthHigh: { type: sequelize_1.DataTypes.FLOAT, allowNull: false, },
    threeWeekHigh: { type: sequelize_1.DataTypes.FLOAT, allowNull: false, },
    twoWeekHigh: { type: sequelize_1.DataTypes.FLOAT, allowNull: false, },
    weekHigh: { type: sequelize_1.DataTypes.FLOAT, allowNull: false, },
    threeDaysHigh: { type: sequelize_1.DataTypes.FLOAT, allowNull: false, },
    twoDaysHigh: { type: sequelize_1.DataTypes.FLOAT, allowNull: false, },
    yesterdayHigh: { type: sequelize_1.DataTypes.FLOAT, allowNull: false, },
    todayHigh: { type: sequelize_1.DataTypes.FLOAT, allowNull: false, },
    createdAt: helpers_1.createdAtAttribute,
    updatedAt: helpers_1.updatedAtAttribute,
}, { sequelize: helpers_1.sequelize, modelName: 'SymbolHigh', tableName: 'symbol_highs' });
exports.default = SymbolHigh;
