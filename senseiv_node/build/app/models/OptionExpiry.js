"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const helpers_1 = require("../helpers/helpers");
class OptionExpiry extends sequelize_1.Model {
}
OptionExpiry.init({
    id: helpers_1.idAttribute,
    symbol: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    option: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    optionStrike: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        field: 'option_strike'
    },
    optionExpiry: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
        field: 'option_expiry'
    },
    createdAt: helpers_1.createdAtAttribute,
    updatedAt: helpers_1.updatedAtAttribute,
}, { sequelize: helpers_1.sequelize, modelName: 'OptionExpiry', tableName: 'option_expiries' });
exports.default = OptionExpiry;
