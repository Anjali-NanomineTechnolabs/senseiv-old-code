import {sleep} from "../helpers/helpers";
import EventEmitter from "events";

const {
    rtConnect,
    rtDisconnect,
    rtSubscribe,
    rtUnsubscribe,
    rtFeed,
    isSocketConnected
} = require('./../../../node_modules/truedata-nodejs/index.js')

class TrueDataSocket extends EventEmitter {
    private isSocketConnected: boolean = false;
    private symbols: string[];
    private newSymbolsToSubscribe: string[];
    private newSubscribeInterval: NodeJS.Timeout | null = null;
    private newSymbolsToUnsubscribe: string[];
    private newUnsubscribeInterval: NodeJS.Timeout | null = null;

    constructor(symbols: string[] = []) {
        super();
        this.isSocketConnected = false
        this.symbols = symbols
        this.newSymbolsToSubscribe = []
        this.newSymbolsToUnsubscribe = []
        rtFeed.on('touchline', this.#touchlineHandler); // Receives Touchline Data
        rtFeed.on('tick', this.#tickHandler); // Receives Tick data
        rtFeed.on('greeks', this.#greeksHandler); // Receives Greeks data
        rtFeed.on('bidask', this.#bidaskHandler); // Receives Bid Ask data if enabled
        rtFeed.on('bidaskL2', this.#bidaskL2Handler); // Receives level 2 Bid Ask data only for BSE exchange
        rtFeed.on('bar', this.#barHandler); // Receives 1min and 5min bar data
        rtFeed.on('marketstatus', this.#marketStatusHandler); // Receives marketstatus messages
        rtFeed.on('heartbeat', this.#heartbeatHandler); // Receives heartbeat message and time

        this.#connect()
    }

    #connect = () => {
        const user = process.env.TRUEDATA_USERNAME || 'tdwsp366'
        const password = process.env.TRUEDATA_PASSWORD || 'amit@366'
        const port = process.env.TRUEDATA_PORT || 8084
        const bidask = 0
        const heartbeat = 0
        const replay = 0

        rtConnect(user, password, this.symbols, port, bidask, heartbeat, replay)

        const interval = setInterval(() => {
            if (isSocketConnected()) {
                clearInterval(interval)
                console.log('TrueData socket connected')
                // giving some breathing room for TrueData socket to connect and be ready
                sleep(2000).then(() => {
                    console.log('SenseIV connection ready')
                    this.emit("connected")
                    this.isSocketConnected = true
                })
            }
        }, 100)

        this.newSubscribeInterval = setInterval(this.newSubscribeIntervalCallback.bind(this), 1500)
        this.newUnsubscribeInterval = setInterval(this.newUnsubscribeIntervalCallback.bind(this), 1500)
    }

    subscribe = (symbols: string[]) => {
        if (!this.isSocketConnected || !symbols) return

        this.newSymbolsToSubscribe = [...this.newSymbolsToSubscribe, ...symbols]
    }

    unsubscribe = (symbols: string[]) => {
        if (!this.isSocketConnected || !symbols) return

        this.newSymbolsToUnsubscribe = [...this.newSymbolsToUnsubscribe, ...symbols]
    }

    private newSubscribeIntervalCallback = () => {
        if (!this.isSocketConnected) return

        if (this.newSymbolsToSubscribe.length) {
            this.symbols = [...this.symbols, ...this.newSymbolsToSubscribe]
            rtSubscribe(this.symbols)
            this.newSymbolsToSubscribe = []
        }
    }

    private newUnsubscribeIntervalCallback = () => {
        if (!this.isSocketConnected) return

        if (this.newSymbolsToUnsubscribe.length) {
            this.symbols = this.symbols.filter(s => !this.newSymbolsToUnsubscribe.includes(s))
            rtUnsubscribe(this.newSymbolsToUnsubscribe)
            this.newSymbolsToUnsubscribe = []
        }
    }

    stop = () => {
        if (!this.isSocketConnected) return

        if (this.newSubscribeInterval) clearInterval(this.newSubscribeInterval)

        rtFeed.removeAllListeners()

        rtDisconnect()
    }

    #touchlineHandler = (touchline: any) => {
        // console.log("touchline", touchline)
    }

    #tickHandler = (tick: any) => {
        this.emit("stock", tick)
    }

    #greeksHandler = (greeks: any) => {
        this.emit("greek", greeks)
    }

    #bidaskHandler = (bidask: any) => {
        console.log("bidask", bidask)
    }

    #bidaskL2Handler = (bidaskL2: any) => {
        console.log("bidaskL2", bidaskL2)
    }

    #barHandler = (bar: any) => {
        console.log("bar", bar)
    }

    #marketStatusHandler = (status: any) => {
        console.log("market-status", status)
    }

    #heartbeatHandler = (heartbeat: any) => {
        // console.log("heartbeat", heartbeat)
    }
}

export default TrueDataSocket