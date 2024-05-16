/// <reference types="node" />
import App from "../App";
import TrueDataSocket from "./TrueData";
declare class SenseIV {
    app: App;
    trueDataSocket: TrueDataSocket | null;
    timer: NodeJS.Timeout | null;
    private allSymbols;
    private atmStrikeValuesForCE;
    private atmStrikeValuesForPE;
    private optionExpiries;
    private allStrikeValues;
    private optionHighValues;
    private ratio_to_calculate_atm;
    constructor(app: App);
    start(): void;
    private startConnectionTrigger;
    private startConnection;
    private onTrueDataSocketConnected;
    private onStockUpdate;
    private checkForNewStrikeForCE;
    private checkForNewStrikeForPE;
    private checkStockHighUpdate;
    private stopConnection;
}
export default SenseIV;
