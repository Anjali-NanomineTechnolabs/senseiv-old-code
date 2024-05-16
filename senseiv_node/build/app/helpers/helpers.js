"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvJSON = exports.nearestValue = exports.arrayPluck = exports.isEmail = exports.sleep = exports.isDate = exports.jsonResponse = exports.deletedAtAttribute = exports.updatedAtAttribute = exports.createdAtAttribute = exports.idAttribute = exports.now = exports.adminEmail = exports.sequelize = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const Database_1 = __importDefault(require("../database/Database"));
const sequelize_1 = require("sequelize");
// Database connection
exports.sequelize = Database_1.default.getConnection();
exports.adminEmail = process.env.ADMIN_EMAIL || 'admin@senseiv.in';
const now = (date = null) => {
    if (date) {
        return (0, moment_timezone_1.default)(date).tz(process.env.TZ || 'Asia/Kolkata').format("YYYY-MM-DD HH:mm:ss");
    }
    return (0, moment_timezone_1.default)().tz(process.env.TZ || 'Asia/Kolkata').format("YYYY-MM-DD HH:mm:ss");
};
exports.now = now;
// Default attribute definitions
exports.idAttribute = {
    type: sequelize_1.DataTypes.BIGINT({ length: 11 }),
    autoIncrement: true,
    primaryKey: true,
};
exports.createdAtAttribute = {
    type: sequelize_1.DataTypes.DATE,
    allowNull: true,
    defaultValue: sequelize_1.Sequelize.literal("CURRENT_TIMESTAMP"),
    field: 'created_at'
};
exports.updatedAtAttribute = {
    type: sequelize_1.DataTypes.DATE,
    allowNull: true,
    defaultValue: sequelize_1.Sequelize.literal("CURRENT_TIMESTAMP"),
    field: 'updated_at'
};
exports.deletedAtAttribute = {
    type: sequelize_1.DataTypes.DATE,
    allowNull: true,
    field: 'deleted_at'
};
const jsonResponse = (data, success = true, message = null, code = "200") => {
    return {
        success,
        message: message || (success ? 'Success' : 'Error'),
        data,
        code
    };
};
exports.jsonResponse = jsonResponse;
const isDate = (date) => {
    const parsed = Date.parse(date);
    // @ts-ignore
    return !isNaN(parsed);
};
exports.isDate = isDate;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
exports.sleep = sleep;
const isEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
exports.isEmail = isEmail;
const arrayPluck = (array, key) => {
    return array.map(item => item[key]);
};
exports.arrayPluck = arrayPluck;
const nearestValue = (array, value) => {
    return array.reduce((prev, curr) => {
        return (Math.abs(parseInt(curr) - value) < Math.abs(parseInt(prev) - value) ? curr : prev);
    });
};
exports.nearestValue = nearestValue;
const csvJSON = (csvStr) => {
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
};
exports.csvJSON = csvJSON;
