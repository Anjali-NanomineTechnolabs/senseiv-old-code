"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const helpers_1 = require("../helpers/helpers");
class SymbolAlert extends sequelize_1.Model {
}
SymbolAlert.init({
    id: helpers_1.idAttribute,
    symbol: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    optionType: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'CE'
    },
    period: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    volume: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    createdAt: helpers_1.createdAtAttribute,
    updatedAt: helpers_1.updatedAtAttribute
}, {
    sequelize: helpers_1.sequelize,
    modelName: 'SymbolAlert',
    tableName: 'symbol_alerts',
    indexes: [
        {
            name: 'symbol_period_symbol',
            fields: ['symbol'],
            unique: false,
            using: 'BTREE'
        }
    ]
});
exports.default = SymbolAlert;
