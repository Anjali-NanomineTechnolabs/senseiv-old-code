"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const helpers_1 = require("../helpers/helpers");
class Setting extends sequelize_1.Model {
    static async getByName(name) {
        return await Setting.findOne({ where: { name } });
    }
    static async getRatioToCalculateATM() {
        const setting = await Setting.getByName('ratio_to_calculate_atm');
        return setting ? parseFloat(setting.value) : 1;
    }
}
Setting.init({
    id: helpers_1.idAttribute,
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    value: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    createdAt: helpers_1.createdAtAttribute,
    updatedAt: helpers_1.updatedAtAttribute
}, {
    sequelize: helpers_1.sequelize,
    modelName: 'Setting',
    tableName: 'settings',
    indexes: [
        {
            name: 'settings_name',
            fields: ['name'],
            unique: true,
            using: 'BTREE'
        }
    ]
});
exports.default = Setting;
