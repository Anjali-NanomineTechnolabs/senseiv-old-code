"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const helpers_1 = require("../helpers/helpers");
class Symbol extends sequelize_1.Model {
    static async updateSymbolOptions(option, optionType, symbol) {
        const updates = {};
        if (optionType === 'CE') {
            updates.currentCESymbol = option;
        }
        else {
            updates.currentPESymbol = option;
        }
        await Symbol.update(updates, { where: { name: symbol } });
    }
}
Symbol.init({
    id: helpers_1.idAttribute,
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    currentCESymbol: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        field: 'current_ce_symbol'
    },
    currentPESymbol: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        field: 'current_pe_symbol'
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
    },
    createdAt: helpers_1.createdAtAttribute,
    updatedAt: helpers_1.updatedAtAttribute,
}, {
    sequelize: helpers_1.sequelize,
    modelName: 'Symbol',
    tableName: 'symbols',
    indexes: [
        {
            name: 'symbol_name_symbol',
            fields: ['name'],
            unique: true,
            using: 'BTREE'
        }
    ]
});
exports.default = Symbol;
