import { DataTypes, Sequelize } from "sequelize";
export declare const sequelize: Sequelize;
export declare const adminEmail: string;
export declare const now: (date?: Date | string | null) => string;
export declare const idAttribute: {
    type: DataTypes.BigIntDataType;
    autoIncrement: boolean;
    primaryKey: boolean;
};
export declare const createdAtAttribute: {
    type: DataTypes.DateDataTypeConstructor;
    allowNull: boolean;
    defaultValue: import("sequelize/types/utils").Literal;
    field: string;
};
export declare const updatedAtAttribute: {
    type: DataTypes.DateDataTypeConstructor;
    allowNull: boolean;
    defaultValue: import("sequelize/types/utils").Literal;
    field: string;
};
export declare const deletedAtAttribute: {
    type: DataTypes.DateDataTypeConstructor;
    allowNull: boolean;
    field: string;
};
export declare const jsonResponse: (data: object | null, success?: boolean, message?: string | null, code?: string) => {
    success: boolean;
    message: string;
    data: object | null;
    code: string;
};
export declare const isDate: (date: string) => boolean;
export declare const sleep: (ms: number) => Promise<unknown>;
export declare const isEmail: (email: string) => boolean;
export declare const arrayPluck: (array: any[], key: string) => any[];
export declare const nearestValue: (array: (number | string)[], value: number) => string | number;
export declare const csvJSON: (csvStr: string) => {}[];
