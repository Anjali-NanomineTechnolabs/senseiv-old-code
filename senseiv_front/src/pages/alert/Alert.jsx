import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom';
import {socket} from "../../helpers/socket";
import axios from "../../helpers/axios";

const Alert = () => {
    const params = useParams();

    const [symbolName, setSymbolName] = useState('');
    const [CEAlerts, setCEAlerts] = useState([]);
    const [PEAlerts, setPEAlerts] = useState([]);
    const [historyAlerts, setHistoryAlerts] = useState([]);

    useEffect(() => {
        if (!params.symbol) return

        setSymbolName(params.symbol)

        const socketConnected = () => socket.emit('join', `high-updates-${params.symbol}`);

        socket.connect();
        socket.on('connect', socketConnected);
        socket.on(`high-update`, onHighUpdates);

        return () => {
            socket.off('connect', socketConnected);
            socket.off(`high-update`, onHighUpdates);
            socket.disconnect();
        }
    }, [])

    useEffect(() => {
        if (params.symbol) return

        const socketConnected = () => socket.emit('join', `high-updates`);

        socket.connect();
        socket.on('connect', socketConnected);
        socket.on(`high-update`, onHighUpdates);

        return () => {
            socket.off('connect', socketConnected);
            socket.off(`high-update`, onHighUpdates);
            socket.disconnect();
        }
    }, [])

    useEffect(() => {
        getHistoryAlerts()

        axios.get(`symbol/alerts/${params.symbol || ''}`).then((response) => {
            if (response.data.data.CEAlerts && response.data.data.PEAlerts) {
                response.data.data.CEAlerts = response.data.data.CEAlerts.map((high) => ({
                    symbol: high.symbol,
                    option: high.optionType,
                    type: high.period,
                    price: high.volume,
                    time: high.createdAt
                }))

                response.data.data.PEAlerts = response.data.data.PEAlerts.map((high) => ({
                    symbol: high.symbol,
                    option: high.optionType,
                    type: high.period,
                    price: high.volume,
                    time: high.createdAt
                }))

                setCEAlerts(response.data.data.CEAlerts)
                setPEAlerts(response.data.data.PEAlerts)
            }
        })
    }, [])

    const onHighUpdates = (high) => {
        if (high.symbolType === 'CE') {
            setCEAlerts((prevCEAlerts) => {
                if (prevCEAlerts.length > 20) prevCEAlerts.pop()

                prevCEAlerts.unshift(high)

                return [...prevCEAlerts]
            })
        } else {
            setPEAlerts((prevPEAlerts) => {
                if (prevPEAlerts.length > 20) prevPEAlerts.pop()

                prevPEAlerts.unshift(high)

                return [...prevPEAlerts]
            })
        }
    }

    const getHistoryAlerts = async () => {
        const response = await axios.get(`symbol/alerts/history/${params.symbol || ''}`)
        if (response.data.success) {
            setHistoryAlerts(response.data.data)
        }
    }

    const camelCaseToSentenceCase = (camelCase) => {
        return camelCase.replace(/([A-Z])/g, " $1").toLowerCase().trim();
    }

    return (
        <>
            <section className='alert_section'>
                <div className="container">
                    <div className="alert_area">
                        <div className="top_text">
                            <h4>Live Vol Alerts For, {symbolName ? symbolName : 'All Symbols'}</h4>
                        </div>
                        <div className="alert_box_area">
                            <div className="row justify-content-between">

                                <div className="col-sm-6">
                                    <div className="row" style={{paddingRight: '7px'}}>
                                        {CEAlerts.map((high, index) => (
                                            <div className="alert_box col-sm-12" style={{
                                                borderColor: "#2ECE8A",
                                                padding: 0
                                            }} key={index}>
                                                <div className="top_area">
                                                    <p>{high.symbol}</p>
                                                </div>

                                                <div className="bottom_area">
                                                    <h6>{high.option} {camelCaseToSentenceCase(high.type)}</h6>
                                                    <h5>Vol: {high.price}</h5>
                                                    <h5>Alert Time: {new Date(high.time).toLocaleString()}</h5>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div className="row" style={{paddingLeft: '7px'}}>
                                        {PEAlerts.map((high, index) => (
                                            <div className="alert_box col-sm-12" style={{
                                                borderColor: "#F44488",
                                                padding: 0
                                            }} key={index}>
                                                <div className="top_area">
                                                    <p>{high.symbol}</p>
                                                </div>

                                                <div className="bottom_area">
                                                    <h6>{high.option} {camelCaseToSentenceCase(high.type)}</h6>
                                                    <h5>Vol: {high.price}</h5>
                                                    <h5>Alert Time: {new Date(high.time).toLocaleString()}</h5>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="dashboard_section">
                        <div className="dashboard_area">
                            <div className="top_text_area">
                                <div style={{display: 'flex'}}>
                                    <h4 style={{flexGrow: 1}}>
                                        Vol Alerts History For, {symbolName ? symbolName : 'All Symbols'}
                                    </h4>
                                    <button className="btn-primary" onClick={getHistoryAlerts}>Refresh</button>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover m-0">
                                    <thead>
                                    <tr>
                                        <th>Symbol</th>
                                        <th>Option</th>
                                        <th>Period</th>
                                        <th>Volume</th>
                                        <th>Alert Time</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {historyAlerts.map((high, index) => (
                                        <tr key={index}>
                                            <td>{high.symbol}</td>
                                            <td>{high.optionType}</td>
                                            <td>{camelCaseToSentenceCase(high.period)}</td>
                                            <td>{high.volume}</td>
                                            <td>{new Date(high.createdAt).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Alert