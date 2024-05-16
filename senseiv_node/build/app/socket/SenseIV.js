"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OptionExpiry_1 = __importDefault(require("../models/OptionExpiry"));
const SymbolHigh_1 = __importDefault(require("../models/SymbolHigh"));
const helpers_1 = require("../helpers/helpers");
const Symbol_1 = __importDefault(require("../models/Symbol"));
const TrueData_1 = __importDefault(require("./TrueData"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const Setting_1 = __importDefault(require("../models/Setting"));
class SenseIV {
    app;
    trueDataSocket = null;
    timer = null;
    // initialize required variables for socket connection to work
    allSymbols = []; // all symbols from database
    atmStrikeValuesForCE = {}; // ATM strike prices for all CE options
    atmStrikeValuesForPE = {}; // ATM strike prices for all PE options
    optionExpiries = []; // option expiry for all symbols
    allStrikeValues = {}; // all strike prices for all symbols
    optionHighValues = []; // high values for all symbols clone from database
    ratio_to_calculate_atm = 1; // 1% change
    constructor(app) {
        this.app = app;
    }
    start() {
        this.timer = setInterval(this.startConnectionTrigger.bind(this), 1000 * 60 * 5); // every 5 minutes
        if (!this.trueDataSocket)
            this.startConnectionTrigger();
    }
    startConnectionTrigger() {
        const currentTime = (0, moment_timezone_1.default)().tz('Asia/Kolkata');
        const currentHour = currentTime.get('hour');
        // and if time is greater than 9AM start the connection
        if (currentHour >= 9 && currentHour < 16 && !this.trueDataSocket) {
            this.startConnection();
            return;
        }
        // if time is greater than 4PM close the connection
        if (currentHour > 16 && this.trueDataSocket) {
            this.stopConnection();
            return;
        }
    }
    startConnection() {
        // start TrueData socket server
        this.trueDataSocket = new TrueData_1.default();
        this.trueDataSocket?.on("connected", this.onTrueDataSocketConnected.bind(this));
        // option updates
        this.trueDataSocket?.on("greek", (greek) => {
            this.app.socketIO.to('greek-updates').emit('greek-update', greek);
            // check for high value
            this.checkStockHighUpdate(greek);
        });
        // stock update
        this.trueDataSocket?.on("stock", this.onStockUpdate.bind(this));
    }
    onTrueDataSocketConnected = async () => {
        // get all symbols from database and add to trueData
        this.allSymbols = await Symbol_1.default.findAll({ attributes: ['name'], where: { isActive: true } });
        this.optionHighValues = await SymbolHigh_1.default.findAll();
        this.optionExpiries = await OptionExpiry_1.default.findAll();
        this.ratio_to_calculate_atm = await Setting_1.default.getRatioToCalculateATM();
        console.log("ratio to calculate atm", this.ratio_to_calculate_atm);
        for (const symbol of this.allSymbols) {
            const symbolExpiries = this.optionExpiries.filter((optionExpiry) => optionExpiry.symbol === symbol.name);
            for (const symbolExpiry of symbolExpiries) {
                if (this.allStrikeValues[symbol.name] && this.allStrikeValues[symbol.name][symbolExpiry.optionStrike])
                    continue;
                if (!this.allStrikeValues[symbol.name])
                    this.allStrikeValues[symbol.name] = {};
                const options = (0, helpers_1.arrayPluck)(symbolExpiries.filter((optionExpiry) => optionExpiry.optionStrike === symbolExpiry.optionStrike), 'option');
                this.allStrikeValues[symbol.name][symbolExpiry.optionStrike] = {
                    CE: options.find((option) => option.endsWith('CE')),
                    PE: options.find((option) => option.endsWith('PE')),
                };
            }
        }
        // subscribe all symbols
        // this.trueDataSocket?.subscribe(['NIFTY-I','BANKNIFTY-I'])
        this.trueDataSocket?.subscribe((0, helpers_1.arrayPluck)(this.allSymbols, 'name'));
    };
    onStockUpdate = (stock) => {
        // if symbol is not in database
        // it means it is an option update and not stock update
        if (!this.allStrikeValues[stock.Symbol] || (stock.Symbol.endsWith('CE') || stock.Symbol.endsWith('PE'))) {
            this.app.socketIO.to('option-updates').emit('option-update', stock);
            return;
        }
        // send stock updates to all clients
        this.app.socketIO.to('stock-updates').emit('stock-update', stock);
        // check for new ATM strike price for CE
        const updatedSymbolForCE = this.checkForNewStrikeForCE(stock);
        // check for new ATM strike price for PE
        const updatedSymbolForPE = this.checkForNewStrikeForPE(stock);
        // if there is change in strike price then update new symbols in High table
        if (updatedSymbolForCE) {
            const optionHigh = this.optionHighValues.find((optionHigh) => optionHigh.symbol === stock.Symbol && optionHigh.type === 'CE');
            if (optionHigh) {
                optionHigh.typeSymbol = updatedSymbolForCE.newStrikeSymbol;
                optionHigh.save();
            }
        }
        if (updatedSymbolForPE) {
            const optionHigh = this.optionHighValues.find((optionHigh) => optionHigh.symbol === stock.Symbol && optionHigh.type === 'PE');
            if (optionHigh) {
                optionHigh.typeSymbol = updatedSymbolForPE.newStrikeSymbol;
                optionHigh.save();
            }
        }
        // unsubscribe from old strike price and subscribe to new strike price
        // creating new array because unsubscribe method mutates the array
        const newSymbolsToAdd = [...(updatedSymbolForCE ? [updatedSymbolForCE.newStrikeSymbol] : []), ...(updatedSymbolForPE ? [updatedSymbolForPE.newStrikeSymbol] : [])].filter(s => s);
        const oldSymbolsToRemove = [...(updatedSymbolForCE ? [updatedSymbolForCE.oldStrikeSymbol] : []), ...(updatedSymbolForPE ? [updatedSymbolForPE.oldStrikeSymbol] : [])].filter(s => s);
        if (oldSymbolsToRemove.length)
            this.trueDataSocket?.unsubscribe(oldSymbolsToRemove);
        if (newSymbolsToAdd.length) {
            this.trueDataSocket?.subscribe(newSymbolsToAdd);
        }
    };
    checkForNewStrikeForCE = (stock) => {
        const currentPrice = stock.LTP;
        const upperStrikePriceForCE = currentPrice + (currentPrice * this.ratio_to_calculate_atm / 100);
        // if ATM strike price is changed
        const newStrikePriceForCE = (0, helpers_1.nearestValue)(Object.keys(this.allStrikeValues[stock.Symbol]), upperStrikePriceForCE);
        const currentStrikePriceForCE = this.atmStrikeValuesForCE[stock.Symbol];
        if (!currentStrikePriceForCE || currentStrikePriceForCE !== newStrikePriceForCE) {
            // update atmStrikeValues
            this.atmStrikeValuesForCE[stock.Symbol] = newStrikePriceForCE;
            const newStrikeSymbol = this.allStrikeValues[stock.Symbol][newStrikePriceForCE]['CE'];
            const oldStrikeSymbol = currentStrikePriceForCE ? this.allStrikeValues[stock.Symbol][currentStrikePriceForCE]['CE'] : null;
            // send message to client(socket) to update strike price
            this.app.socketIO.to('strike-updates').emit('strike-update', {
                Symbol: stock.Symbol,
                oldSymbol: oldStrikeSymbol,
                newSymbol: newStrikeSymbol,
                type: 'CE'
            });
            // update current strike symbols in database
            Symbol_1.default.updateSymbolOptions(newStrikeSymbol, 'CE', stock.Symbol);
            return { newStrikeSymbol, oldStrikeSymbol }; // return strike symbols to unsubscribe and subscribe
        }
        return null;
    };
    checkForNewStrikeForPE = (stock) => {
        const currentPrice = stock.LTP;
        const lowerStrikePriceForPE = currentPrice - (currentPrice * this.ratio_to_calculate_atm / 100);
        const newStrikePriceForPE = (0, helpers_1.nearestValue)(Object.keys(this.allStrikeValues[stock.Symbol]), lowerStrikePriceForPE);
        const currentStrikePriceForPE = this.atmStrikeValuesForPE[stock.Symbol];
        if (!currentStrikePriceForPE || currentStrikePriceForPE !== newStrikePriceForPE) {
            // update atmStrikeValues
            this.atmStrikeValuesForPE[stock.Symbol] = newStrikePriceForPE;
            const newStrikeSymbol = this.allStrikeValues[stock.Symbol][newStrikePriceForPE]['PE'];
            const oldStrikeSymbol = currentStrikePriceForPE ? this.allStrikeValues[stock.Symbol][currentStrikePriceForPE]['PE'] : null;
            // send message to client(socket) to update strike price
            this.app.socketIO.to('strike-updates').emit('strike-update', {
                Symbol: stock.Symbol,
                oldSymbol: oldStrikeSymbol,
                newSymbol: newStrikeSymbol,
                type: 'PE'
            });
            // update current strike symbols in database
            Symbol_1.default.updateSymbolOptions(newStrikeSymbol, 'PE', stock.Symbol);
            return { newStrikeSymbol, oldStrikeSymbol }; // return strike symbols to unsubscribe and subscribe
        }
        return null;
    };
    checkStockHighUpdate = (greek) => {
        const currentPrice = greek.IV;
        const optionHigh = this.optionHighValues.find((optionHigh) => optionHigh.typeSymbol === greek.Symbol);
        const symbolType = greek.Symbol.endsWith('CE') ? 'CE' : 'PE';
        const symbolName = greek.Symbol.split((0, moment_timezone_1.default)().tz('Asia/Kolkata').format('YYMM'))[0] + '-I';
        if (optionHigh) {
            for (const highType of SymbolHigh_1.default.highTypes) {
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
                        time: (0, helpers_1.now)()
                    });
                    // update high value in database
                    // @ts-ignore
                    optionHigh[highType] = currentPrice;
                    optionHigh.save();
                    // create SymbolAlert for high value
                    optionHigh.createSymbolAlert(highType, currentPrice, symbolType);
                }
            }
        }
    };
    stopConnection() {
        if (this.trueDataSocket) {
            this.trueDataSocket.removeAllListeners();
            this.trueDataSocket.stop();
        }
        // Clear the variables
        this.allSymbols = [];
        this.atmStrikeValuesForCE = {};
        this.atmStrikeValuesForPE = {};
        this.optionExpiries = [];
        this.allStrikeValues = {};
        this.optionHighValues = [];
        this.trueDataSocket = null;
    }
}
exports.default = SenseIV;
