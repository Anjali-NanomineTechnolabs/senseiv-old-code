import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {createdAtAttribute, idAttribute, sequelize, updatedAtAttribute} from "../helpers/helpers";

class OptionExpiry extends Model<InferAttributes<OptionExpiry>, InferCreationAttributes<OptionExpiry>> {
    declare id: CreationOptional<number>;

    declare symbol: string;
    declare option: string;

    declare optionStrike: string;
    declare optionExpiry: string;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

OptionExpiry.init({
    id: idAttribute,
    symbol: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    option: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    optionStrike: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'option_strike'
    },
    optionExpiry: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'option_expiry'
    },
    createdAt: createdAtAttribute,
    updatedAt: updatedAtAttribute,
}, {sequelize, modelName: 'OptionExpiry', tableName: 'option_expiries'})

export default OptionExpiry