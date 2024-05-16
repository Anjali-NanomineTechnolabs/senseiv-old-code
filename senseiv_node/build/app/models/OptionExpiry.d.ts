import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
declare class OptionExpiry extends Model<InferAttributes<OptionExpiry>, InferCreationAttributes<OptionExpiry>> {
    id: CreationOptional<number>;
    symbol: string;
    option: string;
    optionStrike: string;
    optionExpiry: string;
    createdAt: CreationOptional<Date>;
    updatedAt: CreationOptional<Date>;
}
export default OptionExpiry;
