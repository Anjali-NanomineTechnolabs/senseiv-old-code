"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const currentTime = (0, moment_timezone_1.default)().tz('Asia/Kolkata');
const currentHour = currentTime.get('hour');
console.log(currentHour);
