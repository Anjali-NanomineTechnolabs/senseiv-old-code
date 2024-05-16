import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "./pages/login/Login";
import User from "./pages/user/User";
import LayOut from './components/layout/LayOut';
import DashBoard from "./pages/dashboard/DashBoard";
import Alert from "./pages/alert/Alert";
import {Toaster} from 'react-hot-toast';
import LiveAnalysis from './pages/live-analysis/LiveAnalysis';
import Settings from "./pages/settings/Settings";
import {authUser} from "./helpers/helpers";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Login/>}/>

                    <Route element={<LayOut/>}>
                        {authUser().isAdmin ? <Route path="/user" element={<User/>}/> : ''}
                        {authUser().isAdmin ? <Route path="/dashboard" element={<DashBoard/>}/> : ''}
                        <Route path="/live-analysis" element={<LiveAnalysis/>}/>
                        <Route path="/alert/:symbol?" element={<Alert/>}/>
                        {authUser().isAdmin ? <Route path="/settings" element={<Settings/>}/> : ''}
                        {/*<Route path="/vol-alert" element={<VolAlert/>}/>*/}
                    </Route>
                </Routes>
                <Toaster/>
            </Router>
        </>
    );
}

export default App;
