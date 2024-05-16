import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {createdAtAttribute, idAttribute, sequelize, updatedAtAttribute} from "../helpers/helpers";

class SymbolAlert extends Model<InferAttributes<SymbolAlert>, InferCreationAttributes<SymbolAlert>> {
    declare id: CreationOptional<number>;
    declare symbol: string;
    declare optionType: string;
    declare period: string;
    declare volume: number;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

SymbolAlert.init({
    id: idAttribute,
    symbol: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    optionType: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'CE'
    },
    period: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    volume: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    createdAt: createdAtAttribute,
    updatedAt: updatedAtAttribute
}, {
    sequelize,
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
})

export default SymbolAlert

