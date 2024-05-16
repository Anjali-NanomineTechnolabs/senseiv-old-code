import React, {useEffect} from 'react'
import Header from '../header/Header'
import {Outlet, useNavigate} from 'react-router-dom'

const LayOut = () => {
    const navigate = useNavigate()

    useEffect(() => {
        setInterval(() => {
            checkToken()
        }, 1000)
    }, [])

    const checkToken = () => {
        const token = localStorage.getItem("token");

        if (token === null) {
            navigate("/")
        }
    }

    return (
        <>
            <Header/>
            <Outlet/>
        </>
    )
}

export default LayOut