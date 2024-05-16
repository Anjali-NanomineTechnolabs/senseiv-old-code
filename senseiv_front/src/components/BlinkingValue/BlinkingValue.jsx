import React, {useEffect, useState} from "react";
import './BlinkingValue.css';

const BlinkingValue = ({value}) => {
    const [stateClass, setStateClass] = useState('');
    const [prevValue, setPrevValue] = useState(0);

    useEffect(() => {
        if (value > prevValue) {
            setStateClass('green-blinking');
        } else if (value < prevValue) {
            setStateClass('red-blinking');
        }

        setPrevValue(value);
        //
        // const timer = setTimeout(() => {
        //     setStateClass('');
        // }, 500);
        //
        // return () => clearTimeout(timer);
    }, [value])

    return (
        <span className={`blinking-value ${stateClass}`}>{value}</span>
    )
}

export default BlinkingValue;