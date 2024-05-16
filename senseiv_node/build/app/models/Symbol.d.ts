import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
declare class Symbol extends Model<InferAttributes<Symbol>, InferCreationAttributes<Symbol>> {
    id: CreationOptional<number>;
    name: string;
    currentCESymbol: CreationOptional<string>;
    currentPESymbol: CreationOptional<string>;
    isActive: boolean;
    createdAt: CreationOptional<Date>;
    updatedAt: CreationOptional<Date>;
    static updateSymbolOptions(option: string, optionType: string, symbol: string): Promise<void>;
}
export default Symbol;
