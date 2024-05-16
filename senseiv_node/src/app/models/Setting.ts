import {DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {createdAtAttribute, idAttribute, sequelize, updatedAtAttribute} from "../helpers/helpers";

class Setting extends Model<InferAttributes<Setting>, InferCreationAttributes<Setting>> {
    declare id: number;
    declare name: string;
    declare value: string;

    declare createdAt: Date;
    declare updatedAt: Date;

    static async getByName(name: string) {
        return await Setting.findOne({where: {name}})
    }

    static async getRatioToCalculateATM() {
        const setting = await Setting.getByName('ratio_to_calculate_atm')
        return setting ? parseFloat(setting.value) : 1
    }
}

Setting.init({
    id: idAttribute,
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false,

    },
    createdAt: createdAtAttribute,
    updatedAt: updatedAtAttribute
}, {
    sequelize,
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
})

export default Setting