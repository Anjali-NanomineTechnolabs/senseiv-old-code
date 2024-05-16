import { InferAttributes, InferCreationAttributes, Model } from "sequelize";
declare class Setting extends Model<InferAttributes<Setting>, InferCreationAttributes<Setting>> {
    id: number;
    name: string;
    value: string;
    createdAt: Date;
    updatedAt: Date;
    static getByName(name: string): Promise<Setting | null>;
    static getRatioToCalculateATM(): Promise<number>;
}
export default Setting;
