import Symbol from "../app/models/Symbol";
import {arrayPluck, csvJSON} from "../app/helpers/helpers";
import axios from "../app/helpers/axios";
import * as process from "process";
import OptionExpiry from "../app/models/OptionExpiry";
import {Dictionary} from "../types/misc";

type SymbolOption = {
    symbolid: string;
    symbol: string;
    series: string;
    expiry: string;
    strike: number;
}

const regex = /([A-Z]+)([0-9]+)([A-Z]+)/

const syncForSymbol = async () => {
    const symbols: string[] = arrayPluck(await Symbol.findAll({attributes: ['name']}), 'name')
    const symbolNames = symbols.map((symbol) => symbol.replace('-I', ''))
    const symbolOptions: Dictionary = {};

    const response = await axios.get(
        "https://api.truedata.in/getAllSymbols?segment=fo&user=tdwsp366&password=amit@366&csv=true&allexpiry=false&csvheader=true&exchsymbol=true",
        {responseType: 'blob'}
    )
    // @ts-ignore
    const allOptions: SymbolOption[] = csvJSON(response.toString())

    if (!allOptions.length) {
        throw new Error('No options found')
    }

    console.log('got all options')

    // for each symbols find all options and ignore futures
    for (const symbolName of symbolNames) {
        const symbolDBName = symbolName + '-I'
        const options = allOptions.filter((option: SymbolOption) => {
            if (!option.symbol) return false;

            return new RegExp(`^(${symbolName})([0-9]{7,12})(CE|PE)`).test(option.symbol)
        })
        if (!options.length) {
            console.log('no options found for symbol', symbolName)
            continue;
        }

        // from this options get the earliest expiry date
        const earliestExpiry = options.reduce((prev: SymbolOption, current: SymbolOption) => {
            // parse date from dd-mm-yyyy format
            const prevDate = new Date(prev.expiry.split('-').reverse().join('-'))
            const currentDate = new Date(current.expiry.split('-').reverse().join('-'))

            if (prevDate < currentDate) return prev
            if (prevDate > currentDate) return current
            return prev
        })

        const currentExistingExpiry = await OptionExpiry.findOne({where: {symbol: symbolDBName}})
        if (currentExistingExpiry) {
            // if current expiry is same as earliest expiry then continue
            // @ts-ignore
            if (currentExistingExpiry.optionExpiry === earliestExpiry.expiry.split('-').reverse().join('-')) {
                continue;
            }

            await OptionExpiry.destroy({where: {symbol: symbolDBName}})
        }

        // save only options with the earliest expiry date
        symbolOptions[symbolDBName] = options.filter((option: SymbolOption) => option.expiry === earliestExpiry.expiry)
    }

    console.log('got all options for symbols')

    for (const symbolOptionsKey in symbolOptions) {
        if (!symbolOptions.hasOwnProperty(symbolOptionsKey)) continue;

        const symbolOptionsValue = symbolOptions[symbolOptionsKey]
        for (const symbolOption of symbolOptionsValue) {
            await OptionExpiry.create({
                symbol: symbolOptionsKey,
                option: symbolOption.symbol,
                optionStrike: symbolOption.strike,
                optionExpiry: symbolOption.expiry.split('-').reverse().join('-')
            })
        }
    }

    console.log('saved all options for symbols')

    return Promise.resolve()
}

syncForSymbol().then(() => {
    process.exit(0)
}).catch((error) => {
    console.log(error)
    process.exit(1)
})