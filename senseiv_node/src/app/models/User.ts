import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Op} from "sequelize";
import {createdAtAttribute, idAttribute, now, sequelize, updatedAtAttribute} from "../helpers/helpers";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare email: string;
    declare password: string;

    declare isActive: CreationOptional<boolean>;
    declare isLoggedIn: CreationOptional<boolean>;

    declare token: CreationOptional<string>;

    declare expiresAt: Date;

    // timestamps!
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static async findActiveByToken(token: string): Promise<User | null> {
        return await User.findOne({where: {token, isActive: true, expiresAt: {[Op.gte]: now()}}})
    }
}

User.init({
    id: idAttribute,
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
    },
    isLoggedIn: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_logged_in'
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at'
    },
    createdAt: createdAtAttribute,
    updatedAt: updatedAtAttribute,
}, {sequelize, modelName: 'User', tableName: 'users'})

export default User