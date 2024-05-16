const {
    rtConnect,
    rtDisconnect,
    rtSubscribe,
    rtUnsubscribe,
    rtFeed,
    isSocketConnected
} = require('truedata-nodejs')
const {EventEmitter} = require("events");
const {sleep} = require("../helpers/helpers");

class TrueDataSocket extends EventEmitter {
    //NIFTY23102618800CE
    constructor(symbols = []) {
        super();
        this.isSocketConnected = false
        this.messageInterval = null
        this.symbols = symbols
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
        const heartbeat = 1
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
    }

    subscribe = (symbols) => {
        if (!this.isSocketConnected) return

        this.symbols = [...this.symbols, ...symbols]
        // console.log('subscribing to', symbols)
        rtSubscribe(this.symbols)
    }

    unsubscribe = (symbols) => {
        if (!symbols) return

        // console.log('unsubscribing to', symbols)

        this.symbols = [...this.symbols.filter(s => !symbols.includes(s))]
        rtUnsubscribe(symbols)
    }

    stop = () => {
        rtDisconnect()
    }

    #touchlineHandler = (touchline) => {
        // console.log("touchline", touchline)
    }

    #tickHandler = (tick) => {
        this.emit("stock", tick)
    }

    #greeksHandler = (greeks) => {
        this.emit("greek", greeks)
    }

    #bidaskHandler = (bidask) => {
        console.log("bidask", bidask)
    }

    #bidaskL2Handler = (bidaskL2) => {
        console.log("bidaskL2", bidaskL2)
    }

    #barHandler = (bar) => {
        console.log("bar", bar)
    }

    #marketStatusHandler = (status) => {
        console.log("market-status", status)
    }

    #heartbeatHandler = (heartbeat) => {
        // console.log("heartbeat", heartbeat)
    }
}

module.exports = TrueDataSocket