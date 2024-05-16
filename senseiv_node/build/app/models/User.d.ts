import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
declare class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    id: CreationOptional<number>;
    name: string;
    email: string;
    password: string;
    isActive: CreationOptional<boolean>;
    isLoggedIn: CreationOptional<boolean>;
    token: CreationOptional<string>;
    expiresAt: Date;
    createdAt: CreationOptional<Date>;
    updatedAt: CreationOptional<Date>;
    static findActiveByToken(token: string): Promise<User | null>;
}
export default User;
