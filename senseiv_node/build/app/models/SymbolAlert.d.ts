import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
declare class SymbolAlert extends Model<InferAttributes<SymbolAlert>, InferCreationAttributes<SymbolAlert>> {
    id: CreationOptional<number>;
    symbol: string;
    optionType: string;
    period: string;
    volume: number;
    createdAt: CreationOptional<Date>;
    updatedAt: CreationOptional<Date>;
}
export default SymbolAlert;
