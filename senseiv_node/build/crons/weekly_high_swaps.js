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
        // twoWeekHigh = high value of weekHigh and twoWeekHigh
        symbol.twoWeekHigh = Math.max(symbol.weekHigh, symbol.twoWeekHigh);
        // threeWeekHigh = high value of twoWeekHigh and weekHigh
        symbol.threeWeekHigh = Math.max(symbol.twoWeekHigh, symbol.weekHigh);
        // weekHigh = every friday update it to 0
        symbol.weekHigh = 0;
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
