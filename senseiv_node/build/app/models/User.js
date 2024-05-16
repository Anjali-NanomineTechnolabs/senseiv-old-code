"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const helpers_1 = require("../helpers/helpers");
class User extends sequelize_1.Model {
    static async findActiveByToken(token) {
        return await User.findOne({ where: { token, isActive: true, expiresAt: { [sequelize_1.Op.gte]: (0, helpers_1.now)() } } });
    }
}
User.init({
    id: helpers_1.idAttribute,
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
    },
    isLoggedIn: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_logged_in'
    },
    token: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    expiresAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: 'expires_at'
    },
    createdAt: helpers_1.createdAtAttribute,
    updatedAt: helpers_1.updatedAtAttribute,
}, { sequelize: helpers_1.sequelize, modelName: 'User', tableName: 'users' });
exports.default = User;
