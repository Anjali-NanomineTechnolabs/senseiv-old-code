"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketClientMiddleware = void 0;
const User_1 = __importDefault(require("../models/User"));
const SocketClientMiddleware = async (socket, next) => {
    const token = (socket.handshake.auth.token || '').replace('Bearer ', '');
    if (!token) {
        throw new Error('Authentication error');
    }
    const user = await User_1.default.findActiveByToken(token);
    if (!user) {
        throw new Error('Authentication error');
    }
    next();
};
exports.SocketClientMiddleware = SocketClientMiddleware;
