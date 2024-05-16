import SymbolHigh from "../app/models/SymbolHigh";
import moment from "moment-timezone";

const updateDailyHigh = async () => {
    const currentTime = moment().tz('Asia/Kolkata')
    const currentHour = currentTime.get('hour')
    if (currentHour < 16) {
        return Promise.resolve('Not the right time to update daily high')
    }

    const symbols = await SymbolHigh.findAll()

    for (const symbol of symbols) {
        // threeDaysHigh = high value of twoDayHigh, today
        symbol.threeDaysHigh = Math.max(symbol.twoDaysHigh, symbol.todayHigh)
        // twoDayHigh = high value of yesterday and today
        symbol.twoDaysHigh = Math.max(symbol.yesterdayHigh, symbol.todayHigh)
        // yesterdayHigh = todayHigh
        symbol.yesterdayHigh = symbol.todayHigh
        // todayHigh = 0
        symbol.todayHigh = 0
        await symbol.save()
    }

    return Promise.resolve('Updated daily high')
}

updateDailyHigh().then(() => {
    console.log('done')
    process.exit(0)
}).catch((error) => {
    console.log(error)
    process.exit(1)
})