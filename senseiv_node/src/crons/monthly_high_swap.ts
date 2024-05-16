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
        // prevCalendarMonthHigh = high of monthHigh and prevCalendarMonthHigh
        symbol.prevCalendarMonthHigh = Math.max(symbol.monthHigh, symbol.prevCalendarMonthHigh)
        // twoMonthsHigh = high of prevCalendarMonthHigh and monthHigh
        symbol.twoMonthsHigh = Math.max(symbol.prevCalendarMonthHigh, symbol.monthHigh)
        // threeMonthsHigh = high of twoMonthsHigh and monthHigh
        symbol.threeMonthsHigh = Math.max(symbol.twoMonthsHigh, symbol.monthHigh)
        // monthHigh = update it to 0 on 1st of every month
        symbol.monthHigh = 0

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