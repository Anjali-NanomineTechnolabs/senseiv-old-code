"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers/helpers");
const events_1 = __importDefault(require("events"));
const { rtConnect, rtDisconnect, rtSubscribe, rtUnsubscribe, rtFeed, isSocketConnected } = require('./../../../node_modules/truedata-nodejs/index.js');
class TrueDataSocket extends events_1.default {
    isSocketConnected = false;
    symbols;
    newSymbolsToSubscribe;
    newSubscribeInterval = null;
    newSymbolsToUnsubscribe;
    newUnsubscribeInterval = null;
    constructor(symbols = []) {
        super();
        this.isSocketConnected = false;
        this.symbols = symbols;
        this.newSymbolsToSubscribe = [];
        this.newSymbolsToUnsubscribe = [];
        rtFeed.on('touchline', this.#touchlineHandler); // Receives Touchline Data
        rtFeed.on('tick', this.#tickHandler); // Receives Tick data
        rtFeed.on('greeks', this.#greeksHandler); // Receives Greeks data
        rtFeed.on('bidask', this.#bidaskHandler); // Receives Bid Ask data if enabled
        rtFeed.on('bidaskL2', this.#bidaskL2Handler); // Receives level 2 Bid Ask data only for BSE exchange
        rtFeed.on('bar', this.#barHandler); // Receives 1min and 5min bar data
        rtFeed.on('marketstatus', this.#marketStatusHandler); // Receives marketstatus messages
        rtFeed.on('heartbeat', this.#heartbeatHandler); // Receives heartbeat message and time
        this.#connect();
    }
    #connect = () => {
        const user = process.env.TRUEDATA_USERNAME || 'tdwsp366';
        const password = process.env.TRUEDATA_PASSWORD || 'amit@366';
        const port = process.env.TRUEDATA_PORT || 8084;
        const bidask = 0;
        const heartbeat = 0;
        const replay = 0;
        rtConnect(user, password, this.symbols, port, bidask, heartbeat, replay);
        const interval = setInterval(() => {
            if (isSocketConnected()) {
                clearInterval(interval);
                console.log('TrueData socket connected');
                // giving some breathing room for TrueData socket to connect and be ready
                (0, helpers_1.sleep)(2000).then(() => {
                    console.log('SenseIV connection ready');
                    this.emit("connected");
                    this.isSocketConnected = true;
                });
            }
        }, 100);
        this.newSubscribeInterval = setInterval(this.newSubscribeIntervalCallback.bind(this), 1500);
        this.newUnsubscribeInterval = setInterval(this.newUnsubscribeIntervalCallback.bind(this), 1500);
    };
    subscribe = (symbols) => {
        if (!this.isSocketConnected || !symbols)
            return;
        this.newSymbolsToSubscribe = [...this.newSymbolsToSubscribe, ...symbols];
    };
    unsubscribe = (symbols) => {
        if (!this.isSocketConnected || !symbols)
            return;
        this.newSymbolsToUnsubscribe = [...this.newSymbolsToUnsubscribe, ...symbols];
    };
    newSubscribeIntervalCallback = () => {
        if (!this.isSocketConnected)
            return;
        if (this.newSymbolsToSubscribe.length) {
            this.symbols = [...this.symbols, ...this.newSymbolsToSubscribe];
            rtSubscribe(this.symbols);
            this.newSymbolsToSubscribe = [];
        }
    };
    newUnsubscribeIntervalCallback = () => {
        if (!this.isSocketConnected)
            return;
        if (this.newSymbolsToUnsubscribe.length) {
            this.symbols = this.symbols.filter(s => !this.newSymbolsToUnsubscribe.includes(s));
            rtUnsubscribe(this.newSymbolsToUnsubscribe);
            this.newSymbolsToUnsubscribe = [];
        }
    };
    stop = () => {
        if (!this.isSocketConnected)
            return;
        if (this.newSubscribeInterval)
            clearInterval(this.newSubscribeInterval);
        rtFeed.removeAllListeners();
        rtDisconnect();
    };
    #touchlineHandler = (touchline) => {
        // console.log("touchline", touchline)
    };
    #tickHandler = (tick) => {
        this.emit("stock", tick);
    };
    #greeksHandler = (greeks) => {
        this.emit("greek", greeks);
    };
    #bidaskHandler = (bidask) => {
        console.log("bidask", bidask);
    };
    #bidaskL2Handler = (bidaskL2) => {
        console.log("bidaskL2", bidaskL2);
    };
    #barHandler = (bar) => {
        console.log("bar", bar);
    };
    #marketStatusHandler = (status) => {
        console.log("market-status", status);
    };
    #heartbeatHandler = (heartbeat) => {
        // console.log("heartbeat", heartbeat)
    };
}
exports.default = TrueDataSocket;
