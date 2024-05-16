import {Socket} from "socket.io";
import User from "../models/User";

export const SocketClientMiddleware = async (socket: Socket, next: any) => {
    const token = (socket.handshake.auth.token as string || '').replace('Bearer ', '')
    if (!token) {
        throw new Error('Authentication error');
    }

    const user = await User.findActiveByToken(token)
    if (!user) {
        throw new Error('Authentication error');
    }

    next();
}