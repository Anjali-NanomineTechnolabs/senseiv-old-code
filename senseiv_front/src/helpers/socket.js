import {io} from 'socket.io-client';
import {authToken} from "../pages/login/helpers";

const URL = process.env.REACT_APP_SOCKET_URL;

let socketConnection;
if (authToken()) {
    socketConnection = io(URL, {
        autoConnect: false,
        transports: ['websocket'],
        auth: {token: authToken()}
    });
} else {
    socketConnection = io(URL, {
        autoConnect: false,
        transports: ['websocket'],
    });
}

export const socket = socketConnection;
