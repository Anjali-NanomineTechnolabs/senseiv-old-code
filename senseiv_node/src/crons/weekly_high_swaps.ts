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
        // twoWeekHigh = high value of weekHigh and twoWeekHigh
        symbol.twoWeekHigh = Math.max(symbol.weekHigh, symbol.twoWeekHigh)
        // threeWeekHigh = high value of twoWeekHigh and weekHigh
        symbol.threeWeekHigh = Math.max(symbol.twoWeekHigh, symbol.weekHigh)
        // weekHigh = every friday update it to 0
        symbol.weekHigh = 0

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