import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {createdAtAttribute, idAttribute, sequelize, updatedAtAttribute} from "../helpers/helpers";
import {Dictionary} from "../../types/misc";

class Symbol extends Model<InferAttributes<Symbol>, InferCreationAttributes<Symbol>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare currentCESymbol: CreationOptional<string>;
    declare currentPESymbol: CreationOptional<string>;
    declare isActive: boolean;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static async updateSymbolOptions(option: string, optionType: string, symbol: string) {
        const updates: Dictionary = {}
        if (optionType === 'CE') {
            updates.currentCESymbol = option
        } else {
            updates.currentPESymbol = option
        }

        await Symbol.update(updates, {where: {name: symbol}})
    }
}

Symbol.init({
    id: idAttribute,
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    currentCESymbol: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'current_ce_symbol'
    },
    currentPESymbol: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'current_pe_symbol'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
    },
    createdAt: createdAtAttribute,
    updatedAt: updatedAtAttribute,
}, {
    sequelize,
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
})

export default Symbol
