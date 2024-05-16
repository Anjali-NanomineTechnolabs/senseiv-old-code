import React, {useEffect, useState} from 'react'
import axios from "axios";
import toast from "react-hot-toast";
import {socket} from "../../helpers/socket";
import BlinkingValue from "../../components/BlinkingValue/BlinkingValue";
import {NavLink} from "react-router-dom";

const LiveAnalysis = () => {
    const [symbols, setSymbols] = useState([]);

    useEffect(() => {
        const socketConnected = () => {
            socket.emit('join', 'stock-updates')
            socket.emit('join', 'option-updates')
            socket.emit('join', 'strike-updates')
            socket.emit('join', 'greek-updates')
        };

        axios.get('symbols').then((response) => {
            if (response.data.success) {
                setSymbols(response.data.data)
                socket.connect();
                socket.on('connect', socketConnected);
                socket.on('stock-update', onStockUpdate);
                socket.on('option-update', onOptionUpdate);
                socket.on('greek-update', onGreekUpdate);
                socket.on('strike-update', strikeUpdate);
            } else {
                toast.error(response.data.message);
            }
        }).catch((error) => {
            toast.error(error);
        })

        return () => {
            socket.off('connect', socketConnected);
            socket.off("option-updates", onOptionUpdate);
            socket.off("greek-updates", onGreekUpdate);
            socket.off("strike-updates", strikeUpdate);
            socket.off("stock-updates", onStockUpdate);
            socket.disconnect();
        }
    }, [])

    const onStockUpdate = (stock) => {
        setSymbols((prevSymbols) => {
            const newState = [...prevSymbols]
            const symbolToUpdateIndex = prevSymbols.findIndex((symbol) => symbol.name === stock.Symbol)
            if (symbolToUpdateIndex !== -1) {
                const symbolToUpdate = prevSymbols[symbolToUpdateIndex]
                symbolToUpdate.LTP = stock.LTP
                newState[symbolToUpdateIndex] = {...symbolToUpdate}
            }
            return newState
        })
    }

    const onOptionUpdate = (option) => {
        setSymbols((prevSymbols) => {
            const newState = [...prevSymbols]
            const symbolToUpdateIndex = prevSymbols.findIndex((symbol) => option.Symbol.startsWith(symbol.name.replace('-I', '')))
            if (symbolToUpdateIndex !== -1) {
                const symbolToUpdate = prevSymbols[symbolToUpdateIndex]
                if (option.Symbol.endsWith('CE')) {
                    symbolToUpdate.CE_LTP = option.LTP;
                    symbolToUpdate.CE_ASK = option.Ask;
                    symbolToUpdate.CE_BID = option.Bid;
                } else {
                    symbolToUpdate.PE_LTP = option.LTP;
                    symbolToUpdate.PE_ASK = option.Ask;
                    symbolToUpdate.PE_BID = option.Bid;
                }
                newState[symbolToUpdateIndex] = {...symbolToUpdate}
            }
            return newState
        })
    }

    const onGreekUpdate = (greek) => {
        setSymbols((prevSymbols) => {
            const newState = [...prevSymbols]
            const symbolToUpdateIndex = prevSymbols.findIndex((s) => s.current_ce_symbol === greek.Symbol || s.current_pe_symbol === greek.Symbol)
            if (symbolToUpdateIndex !== -1) {
                const symbolToUpdate = prevSymbols[symbolToUpdateIndex]
                if (symbolToUpdate.current_ce_symbol === greek.Symbol) {
                    symbolToUpdate.CE_IV = greek.IV;
                    symbolToUpdate.CE_BUY_IV = greek.IV;
                    symbolToUpdate.CE_SELL_IV = greek.IV;
                } else {
                    symbolToUpdate.PE_IV = greek.IV;
                    symbolToUpdate.PE_BUY_IV = greek.IV;
                    symbolToUpdate.PE_SELL_IV = greek.IV;
                }
                newState[symbolToUpdateIndex] = {...symbolToUpdate}
            }
            return newState
        })
    }

    const strikeUpdate = (strike) => {
        setSymbols((prevSymbols) => {
            const symbolToUpdateIndex = symbols.findIndex((symbol) => strike.Symbol === symbol.name)
            const newState = [...prevSymbols]
            if (symbolToUpdateIndex !== -1) {
                const symbolToUpdate = symbols[symbolToUpdateIndex]
                if (strike.type === 'CE') {
                    symbolToUpdate.current_ce_symbol = strike.newSymbol
                } else {
                    symbolToUpdate.current_pe_symbol = strike.newSymbol
                }
                newState[symbolToUpdateIndex] = {...symbolToUpdate}
            }

            return newState
        })
    }

    return (
        <>
            <section className='dashboard_section'>
                <div className="container-fluid">
                    <div className="dashboard_area">
                        <div className="top_text_area">
                            <h5>Symbols Live Analysis</h5>
                        </div>
                        <div className="">
                            <table className="table table-hover m-0">
                                <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Ltp</th>
                                    <th>Ce(Atm)</th>
                                    <th>Ce_ltp</th>
                                    <th>Ce_lv</th>
                                    <th>Ce_lv(Buy)</th>
                                    <th>Ce_lv(Sell)</th>
                                    <th>Pe(Atm)</th>
                                    <th>Pe_Ltp</th>
                                    <th>Pe_Iv</th>
                                    <th>Pe_Iv(Buy)</th>
                                    <th>Pe_Iv(Sell)</th>
                                    <th>Cepe_Iv(Buy)</th>
                                    <th>Cepe_Iv(Sell)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {symbols.length > 0 ? symbols.map((symbol, index) => (
                                    <tr key={symbol.name}>
                                        <td>
                                            <NavLink to={`/alert/${symbol.name}`} className="nav-link" target={"_blank"}>{symbol.name}</NavLink>
                                        </td>
                                        <td><BlinkingValue value={symbol.LTP || 0}/></td>
                                        <td>{symbol.current_ce_symbol || ''}</td>
                                        <td><BlinkingValue value={symbol.CE_LTP || 0}/></td>
                                        <td><BlinkingValue value={symbol.CE_IV || 0}/></td>
                                        <td><BlinkingValue value={symbol.CE_BUY_IV || 0}/></td>
                                        <td><BlinkingValue value={symbol.CE_SELL_IV || 0}/></td>
                                        <td>{symbol.current_pe_symbol || ''}</td>
                                        <td><BlinkingValue value={symbol.PE_LTP || 0}/></td>
                                        <td><BlinkingValue value={symbol.PE_IV || 0}/></td>
                                        <td><BlinkingValue value={symbol.PE_BUY_IV || 0}/></td>
                                        <td><BlinkingValue value={symbol.PE_SELL_IV || 0}/></td>
                                        <td>12.37</td>
                                        <td>12.49</td>
                                    </tr>
                                )) : null}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default LiveAnalysis