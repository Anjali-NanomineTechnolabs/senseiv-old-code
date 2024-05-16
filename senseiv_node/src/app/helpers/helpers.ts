import moment from "moment-timezone";
import Database from "../database/Database";
import {DataTypes, Sequelize} from "sequelize";

// Database connection
export const sequelize = Database.getConnection()

export const adminEmail = process.env.ADMIN_EMAIL || 'admin@senseiv.in'

export const now = (date: Date | string | null = null) => {
    if (date) {
        return moment(date).tz(process.env.TZ || 'Asia/Kolkata').format("YYYY-MM-DD HH:mm:ss");
    }

    return moment().tz(process.env.TZ || 'Asia/Kolkata').format("YYYY-MM-DD HH:mm:ss");
}

// Default attribute definitions
export const idAttribute = {
    type: DataTypes.BIGINT({length: 11}),
    autoIncrement: true,
    primaryKey: true,
}

export const createdAtAttribute = {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    field: 'created_at'
}

export const updatedAtAttribute = {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    field: 'updated_at'
}

export const deletedAtAttribute = {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_at'
}

export const jsonResponse = (data: object | null, success: boolean = true, message: string | null = null, code: string = "200") => {
    return {
        success,
        message: message || (success ? 'Success' : 'Error'),
        data,
        code
    }
}

export const isDate = (date: string) => {
    const parsed = Date.parse(date);
    // @ts-ignore
    return !isNaN(parsed)
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const isEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const arrayPluck = (array: any[], key: string) => {
    return array.map(item => item[key])
}

export const nearestValue = (array: (number | string)[], value: number) => {
    return array.reduce((prev, curr) => {
        return (Math.abs(parseInt(curr as string) - value) < Math.abs(parseInt(prev as string) - value) ? curr : prev);
    });
}

export const csvJSON = (csvStr: string) => {
    let lines = csvStr.split("\n");
    let result = [];

    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step
    // (you might convert them to &&& or something, then covert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/
    let headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
        let obj = {};
        let currentline = lines[i].split(",");
        for (let j = 0; j < headers.length; j++) {
            // @ts-ignore
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return result; //JavaScript object
}