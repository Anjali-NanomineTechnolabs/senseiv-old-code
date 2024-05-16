import App from "../App";
import {Dictionary} from "../../types/misc";
import OptionExpiry from "../models/OptionExpiry";
import SymbolHigh from "../models/SymbolHigh";
import {arrayPluck, nearestValue, now, sleep} from "../helpers/helpers";
import Symbol from "../models/Symbol";
import TrueDataSocket from "./TrueData";
import moment from "moment-timezone";
import Setting from "../models/Setting";

class SenseIV {
    public app: App;
    public trueDataSocket: TrueDataSocket | null = null;
    public timer: NodeJS.Timeout | null = null;

    // initialize required variables for socket connection to work
    private allSymbols: Symbol[] = [] // all symbols from database
    private atmStrikeValuesForCE: Dictionary = {} // ATM strike prices for all CE options
    private atmStrikeValuesForPE: Dictionary = {} // ATM strike prices for all PE options
    private optionExpiries: OptionExpiry[] = [] // option expiry for all symbols
    private allStrikeValues: Dictionary = {} // all strike prices for all symbols
    private optionHighValues: SymbolHigh[] = [] // high values for all symbols clone from database
    private ratio_to_calculate_atm = 1; // 1% change

    constructor(app: App) {
        this.app = app;
    }

    start() {
        this.timer = setInterval(this.startConnectionTrigger.bind(this), 1000 * 60 * 5) // every 5 minutes

        if (!this.trueDataSocket) this.startConnectionTrigger()
    }

    private startConnectionTrigger() {
        const currentTime = moment().tz('Asia/Kolkata')
        const currentHour = currentTime.get('hour')

        // and if time is greater than 9AM start the connection
        if (currentHour >= 9 && currentHour < 16 && !this.trueDataSocket) {
            this.startConnection()
            return
        }

        // if time is greater than 4PM close the connection
        if (currentHour > 16 && this.trueDataSocket) {
            this.stopConnection()
            return
        }
    }

    private startConnection() {
        // start TrueData socket server
        this.trueDataSocket = new TrueDataSocket()
        this.trueDataSocket?.on("connected", this.onTrueDataSocketConnected.bind(this))

        // option updates
        this.trueDataSocket?.on("greek", (greek: any) => {
            this.app.socketIO.to('greek-updates').emit('greek-update', greek)
            // check for high value
            this.checkStockHighUpdate(greek);
        })

        // stock update
        this.trueDataSocket?.on("stock", this.onStockUpdate.bind(this))
    }

    private onTrueDataSocketConnected = async () => {
        // get all symbols from database and add to trueData
        this.allSymbols = await Symbol.findAll({attributes: ['name'], where: {isActive: true}})
        this.optionHighValues = await SymbolHigh.findAll()
        this.optionExpiries = await OptionExpiry.findAll()
        this.ratio_to_calculate_atm = await Setting.getRatioToCalculateATM()
        console.log("ratio to calculate atm", this.ratio_to_calculate_atm)
        for (const symbol of this.allSymbols) {
            const symbolExpiries = this.optionExpiries.filter((optionExpiry: OptionExpiry) => optionExpiry.symbol === symbol.name)
            for (const symbolExpiry of symbolExpiries) {
                if (this.allStrikeValues[symbol.name] && this.allStrikeValues[symbol.name][symbolExpiry.optionStrike]) continue

                if (!this.allStrikeValues[symbol.name]) this.allStrikeValues[symbol.name] = {}
                const options = arrayPluck(symbolExpiries.filter((optionExpiry) => optionExpiry.optionStrike === symbolExpiry.optionStrike), 'option')
                this.allStrikeValues[symbol.name][symbolExpiry.optionStrike] = {
                    CE: options.find((option) => option.endsWith('CE')),
                    PE: options.find((option) => option.endsWith('PE')),
                }
            }
        }
        // subscribe all symbols
        // this.trueDataSocket?.subscribe(['NIFTY-I','BANKNIFTY-I'])
        this.trueDataSocket?.subscribe(arrayPluck(this.allSymbols, 'name'))
    }

    private onStockUpdate = (stock: any) => {
        // if symbol is not in database
        // it means it is an option update and not stock update
        if (!this.allStrikeValues[stock.Symbol] || (stock.Symbol.endsWith('CE') || stock.Symbol.endsWith('PE'))) {
            this.app.socketIO.to('option-updates').emit('option-update', stock)
            return
        }

        // send stock updates to all clients
        this.app.socketIO.to('stock-updates').emit('stock-update', stock)

        // check for new ATM strike price for CE
        const updatedSymbolForCE = this.checkForNewStrikeForCE(stock);

        // check for new ATM strike price for PE
        const updatedSymbolForPE = this.checkForNewStrikeForPE(stock);

        // if there is change in strike price then update new symbols in High table
        if (updatedSymbolForCE) {
            const optionHigh = this.optionHighValues.find((optionHigh: SymbolHigh) => optionHigh.symbol === stock.Symbol && optionHigh.type === 'CE')
            if (optionHigh) {
                optionHigh.typeSymbol = updatedSymbolForCE.newStrikeSymbol
                optionHigh.save()
            }
        }
        if (updatedSymbolForPE) {
            const optionHigh = this.optionHighValues.find((optionHigh: SymbolHigh) => optionHigh.symbol === stock.Symbol && optionHigh.type === 'PE')
            if (optionHigh) {
                optionHigh.typeSymbol = updatedSymbolForPE.newStrikeSymbol
                optionHigh.save()
            }
        }

        // unsubscribe from old strike price and subscribe to new strike price
        // creating new array because unsubscribe method mutates the array
        const newSymbolsToAdd = [...(updatedSymbolForCE ? [updatedSymbolForCE.newStrikeSymbol] : []), ...(updatedSymbolForPE ? [updatedSymbolForPE.newStrikeSymbol] : [])].filter(s => s)
        const oldSymbolsToRemove = [...(updatedSymbolForCE ? [updatedSymbolForCE.oldStrikeSymbol] : []), ...(updatedSymbolForPE ? [updatedSymbolForPE.oldStrikeSymbol] : [])].filter(s => s)
        if (oldSymbolsToRemove.length) this.trueDataSocket?.unsubscribe(oldSymbolsToRemove)
        if (newSymbolsToAdd.length) {
            this.trueDataSocket?.subscribe(newSymbolsToAdd)
        }
    }

    private checkForNewStrikeForCE = (stock: any) => {
        const currentPrice = stock.LTP
        const upperStrikePriceForCE = currentPrice + (currentPrice * this.ratio_to_calculate_atm / 100)
        // if ATM strike price is changed
        const newStrikePriceForCE = nearestValue(Object.keys(this.allStrikeValues[stock.Symbol]), upperStrikePriceForCE)
        const currentStrikePriceForCE = this.atmStrikeValuesForCE[stock.Symbol]
        if (!currentStrikePriceForCE || currentStrikePriceForCE !== newStrikePriceForCE) {
            // update atmStrikeValues
            this.atmStrikeValuesForCE[stock.Symbol] = newStrikePriceForCE
            const newStrikeSymbol = this.allStrikeValues[stock.Symbol][newStrikePriceForCE]['CE']
            const oldStrikeSymbol = currentStrikePriceForCE ? this.allStrikeValues[stock.Symbol][currentStrikePriceForCE]['CE'] : null

            // send message to client(socket) to update strike price
            this.app.socketIO.to('strike-updates').emit('strike-update', {
                Symbol: stock.Symbol,
                oldSymbol: oldStrikeSymbol,
                newSymbol: newStrikeSymbol,
                type: 'CE'
            })

            // update current strike symbols in database
            Symbol.updateSymbolOptions(newStrikeSymbol, 'CE', stock.Symbol)

            return {newStrikeSymbol, oldStrikeSymbol} // return strike symbols to unsubscribe and subscribe
        }

        return null
    }

    private checkForNewStrikeForPE = (stock: any) => {
        const currentPrice = stock.LTP
        const lowerStrikePriceForPE = currentPrice - (currentPrice * this.ratio_to_calculate_atm / 100)
        const newStrikePriceForPE = nearestValue(Object.keys(this.allStrikeValues[stock.Symbol]), lowerStrikePriceForPE)
        const currentStrikePriceForPE = this.atmStrikeValuesForPE[stock.Symbol]
        if (!currentStrikePriceForPE || currentStrikePriceForPE !== newStrikePriceForPE) {
            // update atmStrikeValues
            this.atmStrikeValuesForPE[stock.Symbol] = newStrikePriceForPE
            const newStrikeSymbol = this.allStrikeValues[stock.Symbol][newStrikePriceForPE]['PE']
            const oldStrikeSymbol = currentStrikePriceForPE ? this.allStrikeValues[stock.Symbol][currentStrikePriceForPE]['PE'] : null

            // send message to client(socket) to update strike price
            this.app.socketIO.to('strike-updates').emit('strike-update', {
                Symbol: stock.Symbol,
                oldSymbol: oldStrikeSymbol,
                newSymbol: newStrikeSymbol,
                type: 'PE'
            })

            // update current strike symbols in database
            Symbol.updateSymbolOptions(newStrikeSymbol, 'PE', stock.Symbol)

            return {newStrikeSymbol, oldStrikeSymbol} // return strike symbols to unsubscribe and subscribe
        }

        return null
    }

    private checkStockHighUpdate = (greek: any) => {
        const currentPrice = greek.IV
        const optionHigh = this.optionHighValues.find((optionHigh: any) => optionHigh.typeSymbol === greek.Symbol)
        const symbolType = greek.Symbol.endsWith('CE') ? 'CE' : 'PE'
        const symbolName = greek.Symbol.split(moment().tz('Asia/Kolkata').format('YYMM'))[0] + '-I'
        if (optionHigh) {
            for (const highType of SymbolHigh.highTypes) {
                // @ts-ignore
                if (optionHigh[highType] < currentPrice) {
                    this.app.socketIO
                        .to(['high-updates', `high-updates-${symbolName}`])
                        .emit('high-update', {
                            type: highType,
                            option: greek.Symbol,
                            price: currentPrice,
                            symbol: symbolName,
                            symbolType,
                            time: now()
                        })

                    // update high value in database
                    // @ts-ignore
                    optionHigh[highType] = currentPrice
                    optionHigh.save()

                    // create SymbolAlert for high value
                    optionHigh.createSymbolAlert(highType, currentPrice, symbolType)
                }
            }
        }
    }

    private stopConnection() {
        if (this.trueDataSocket) {
            this.trueDataSocket.removeAllListeners();
            this.trueDataSocket.stop();
        }

        // Clear the variables
        this.allSymbols = []
        this.atmStrikeValuesForCE = {}
        this.atmStrikeValuesForPE = {}
        this.optionExpiries = []
        this.allStrikeValues = {}
        this.optionHighValues = []

        this.trueDataSocket = null
    }
}

export default SenseIV