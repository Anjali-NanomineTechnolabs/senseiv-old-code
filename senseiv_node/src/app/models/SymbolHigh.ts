import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {createdAtAttribute, idAttribute, sequelize, updatedAtAttribute} from "../helpers/helpers";
import SymbolAlert from "./SymbolAlert";

class SymbolHigh extends Model<InferAttributes<SymbolHigh>, InferCreationAttributes<SymbolHigh>> {
    declare id: CreationOptional<number>;
    declare symbol: string;
    declare type: 'CE' | 'PE';
    declare typeSymbol: string;
    declare allTimeHigh: number;
    declare threeMonthsHigh: number;
    declare twoMonthsHigh: number;
    declare monthHigh: number;
    declare prevCalendarMonthHigh: number;
    declare threeWeekHigh: number;
    declare twoWeekHigh: number;
    declare weekHigh: number;
    declare threeDaysHigh: number;
    declare twoDaysHigh: number;
    declare yesterdayHigh: number;
    declare todayHigh: number;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static highTypes = [
        'allTimeHigh', 'threeMonthsHigh', 'twoMonthsHigh', 'monthHigh', 'prevCalendarMonthHigh', 'threeWeekHigh',
        'twoWeekHigh', 'weekHigh', 'threeDaysHigh', 'twoDaysHigh', 'yesterdayHigh', 'todayHigh'
    ];

    async createSymbolAlert(type: string, price: number, optionType: string): Promise<any> {
        return await SymbolAlert.create({symbol: this.symbol, period: type, volume: price, optionType})
    }
}

SymbolHigh.init({
    id: idAttribute,
    symbol: {type: DataTypes.STRING(255), allowNull: false,},
    type: {type: DataTypes.ENUM('PE', 'CE'), allowNull: false, defaultValue: 'CE'},
    typeSymbol: {type: DataTypes.STRING(255), allowNull: false, defaultValue: 'symbol'},
    allTimeHigh: {type: DataTypes.FLOAT, allowNull: false,},
    threeMonthsHigh: {type: DataTypes.FLOAT, allowNull: false,},
    twoMonthsHigh: {type: DataTypes.FLOAT, allowNull: false,},
    monthHigh: {type: DataTypes.FLOAT, allowNull: false,},
    prevCalendarMonthHigh: {type: DataTypes.FLOAT, allowNull: false,},
    threeWeekHigh: {type: DataTypes.FLOAT, allowNull: false,},
    twoWeekHigh: {type: DataTypes.FLOAT, allowNull: false,},
    weekHigh: {type: DataTypes.FLOAT, allowNull: false,},
    threeDaysHigh: {type: DataTypes.FLOAT, allowNull: false,},
    twoDaysHigh: {type: DataTypes.FLOAT, allowNull: false,},
    yesterdayHigh: {type: DataTypes.FLOAT, allowNull: false,},
    todayHigh: {type: DataTypes.FLOAT, allowNull: false,},
    createdAt: createdAtAttribute,
    updatedAt: updatedAtAttribute,
}, {sequelize, modelName: 'SymbolHigh', tableName: 'symbol_highs'})

export default SymbolHigh