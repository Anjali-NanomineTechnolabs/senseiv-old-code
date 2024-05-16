import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
declare class SymbolHigh extends Model<InferAttributes<SymbolHigh>, InferCreationAttributes<SymbolHigh>> {
    id: CreationOptional<number>;
    symbol: string;
    type: 'CE' | 'PE';
    typeSymbol: string;
    allTimeHigh: number;
    threeMonthsHigh: number;
    twoMonthsHigh: number;
    monthHigh: number;
    prevCalendarMonthHigh: number;
    threeWeekHigh: number;
    twoWeekHigh: number;
    weekHigh: number;
    threeDaysHigh: number;
    twoDaysHigh: number;
    yesterdayHigh: number;
    todayHigh: number;
    createdAt: CreationOptional<Date>;
    updatedAt: CreationOptional<Date>;
    static highTypes: string[];
    createSymbolAlert(type: string, price: number, optionType: string): Promise<any>;
}
export default SymbolHigh;
