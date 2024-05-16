/// <reference types="node" />
import EventEmitter from "events";
declare class TrueDataSocket extends EventEmitter {
    #private;
    private isSocketConnected;
    private symbols;
    private newSymbolsToSubscribe;
    private newSubscribeInterval;
    private newSymbolsToUnsubscribe;
    private newUnsubscribeInterval;
    constructor(symbols?: string[]);
    subscribe: (symbols: string[]) => void;
    unsubscribe: (symbols: string[]) => void;
    private newSubscribeIntervalCallback;
    private newUnsubscribeIntervalCallback;
    stop: () => void;
}
export default TrueDataSocket;
