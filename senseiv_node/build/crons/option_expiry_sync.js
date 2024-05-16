"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Symbol_1 = __importDefault(require("../app/models/Symbol"));
const helpers_1 = require("../app/helpers/helpers");
const axios_1 = __importDefault(require("../app/helpers/axios"));
const process = __importStar(require("process"));
const OptionExpiry_1 = __importDefault(require("../app/models/OptionExpiry"));
const regex = /([A-Z]+)([0-9]+)([A-Z]+)/;
const syncForSymbol = async () => {
    const symbols = (0, helpers_1.arrayPluck)(await Symbol_1.default.findAll({ attributes: ['name'] }), 'name');
    const symbolNames = symbols.map((symbol) => symbol.replace('-I', ''));
    const symbolOptions = {};
    const response = await axios_1.default.get("https://api.truedata.in/getAllSymbols?segment=fo&user=tdwsp366&password=amit@366&csv=true&allexpiry=false&csvheader=true&exchsymbol=true", { responseType: 'blob' });
    // @ts-ignore
    const allOptions = (0, helpers_1.csvJSON)(response.toString());
    if (!allOptions.length) {
        throw new Error('No options found');
    }
    console.log('got all options');
    // for each symbols find all options and ignore futures
    for (const symbolName of symbolNames) {
        const symbolDBName = symbolName + '-I';
        const options = allOptions.filter((option) => {
            if (!option.symbol)
                return false;
            return new RegExp(`^(${symbolName})([0-9]{7,12})(CE|PE)`).test(option.symbol);
        });
        if (!options.length) {
            console.log('no options found for symbol', symbolName);
            continue;
        }
        // from this options get the earliest expiry date
        const earliestExpiry = options.reduce((prev, current) => {
            // parse date from dd-mm-yyyy format
            const prevDate = new Date(prev.expiry.split('-').reverse().join('-'));
            const currentDate = new Date(current.expiry.split('-').reverse().join('-'));
            if (prevDate < currentDate)
                return prev;
            if (prevDate > currentDate)
                return current;
            return prev;
        });
        const currentExistingExpiry = await OptionExpiry_1.default.findOne({ where: { symbol: symbolDBName } });
        if (currentExistingExpiry) {
            // if current expiry is same as earliest expiry then continue
            // @ts-ignore
            if (currentExistingExpiry.optionExpiry === earliestExpiry.expiry.split('-').reverse().join('-')) {
                continue;
            }
            await OptionExpiry_1.default.destroy({ where: { symbol: symbolDBName } });
        }
        // save only options with the earliest expiry date
        symbolOptions[symbolDBName] = options.filter((option) => option.expiry === earliestExpiry.expiry);
    }
    console.log('got all options for symbols');
    for (const symbolOptionsKey in symbolOptions) {
        if (!symbolOptions.hasOwnProperty(symbolOptionsKey))
            continue;
        const symbolOptionsValue = symbolOptions[symbolOptionsKey];
        for (const symbolOption of symbolOptionsValue) {
            await OptionExpiry_1.default.create({
                symbol: symbolOptionsKey,
                option: symbolOption.symbol,
                optionStrike: symbolOption.strike,
                optionExpiry: symbolOption.expiry.split('-').reverse().join('-')
            });
        }
    }
    console.log('saved all options for symbols');
    return Promise.resolve();
};
syncForSymbol().then(() => {
    process.exit(0);
}).catch((error) => {
    console.log(error);
    process.exit(1);
});
