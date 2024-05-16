"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SymbolHigh_1 = __importDefault(require("../app/models/SymbolHigh"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const updateDailyHigh = async () => {
    const currentTime = (0, moment_timezone_1.default)().tz('Asia/Kolkata');
    const currentHour = currentTime.get('hour');
    if (currentHour < 16) {
        return Promise.resolve('Not the right time to update daily high');
    }
    const symbols = await SymbolHigh_1.default.findAll();
    for (const symbol of symbols) {
        // threeDaysHigh = high value of twoDayHigh, today
        symbol.threeDaysHigh = Math.max(symbol.twoDaysHigh, symbol.todayHigh);
        // twoDayHigh = high value of yesterday and today
        symbol.twoDaysHigh = Math.max(symbol.yesterdayHigh, symbol.todayHigh);
        // yesterdayHigh = todayHigh
        symbol.yesterdayHigh = symbol.todayHigh;
        // todayHigh = 0
        symbol.todayHigh = 0;
        await symbol.save();
    }
    return Promise.resolve('Updated daily high');
};
updateDailyHigh().then(() => {
    console.log('done');
    process.exit(0);
}).catch((error) => {
    console.log(error);
    process.exit(1);
});
