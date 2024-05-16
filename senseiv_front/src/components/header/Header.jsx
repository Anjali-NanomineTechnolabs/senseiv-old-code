import React from 'react'
import {Link, NavLink, useNavigate} from 'react-router-dom';
import {socket} from "../../helpers/socket";
import {authUser} from "../../helpers/helpers";
import axios from "../../helpers/axios";
import toast from "react-hot-toast";

const Header = () => {

    // Log Out
    const handleLogOut = async () => {
        if (socket.connected) {
            socket.disconnect();
        }

        await axios.post('logout')

        localStorage.clear();
        window.location.href = '/';
    }

    return (
        <>
            <header className='header'>
                <nav className="navbar navbar-expand-lg">
                    <div className="container">

                        <Link className="navbar-brand">
                            <img src="/assets/images/logo.png" alt="SenseIV" style={{height: '90px', width: '100px'}}/>
                        </Link>

                        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                            <i className="fa-solid fa-bars-staggered"></i>
                        </button>

                        <div className="offcanvas offcanvas-start" tabIndex={-1} id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                            <div className="offcanvas-header">
                                <h5 className="offcanvas-title" id="offcanvasExampleLabel">SenseIV</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"/>
                            </div>
                            <div className="offcanvas-body">
                                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                                    {authUser().isAdmin ? <li className="nav-item">
                                        <NavLink to={"/dashboard"} className="nav-link">Dashboard</NavLink>
                                    </li> : ''}
                                    <li className="nav-item">
                                        <NavLink to={"/live-analysis"} className="nav-link">Live Analysis</NavLink>
                                    </li>
                                    {authUser().isAdmin ? <li className="nav-item">
                                        <NavLink to={"/user"} className="nav-link">Users</NavLink>
                                    </li> : ''}
                                    <li className="nav-item">
                                        <NavLink to={"/alert"} target={"_blank"} className="nav-link">High
                                            Logs</NavLink>
                                    </li>
                                    {authUser().isAdmin ? <li className="nav-item">
                                        <NavLink to={"/settings"} className="nav-link">Settings</NavLink>
                                    </li> : ''}
                                    {/* <li className="nav-item">
                                        <NavLink to={"/vol-alert"} className="nav-link">Vol Alert</NavLink>
                                    </li> */}
                                    <li className="nav-item">
                                        <Link to={"/"} className="nav-link" onClick={handleLogOut}>Log Out</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </nav>

            </header>
        </>
    )
}

export default Header