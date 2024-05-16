"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientMiddleware = exports.AdminMiddleware = void 0;
const User_1 = __importDefault(require("../models/User"));
const helpers_1 = require("../helpers/helpers");
const AdminMiddleware = async (request, reply) => {
    try {
        const token = (request.headers.authorization || '').replace('Bearer ', '');
        if (!token) {
            throw new Error('Authentication error');
        }
        const user = await User_1.default.findActiveByToken(token);
        if (!user) {
            throw new Error('Authentication error');
        }
        if (user.email !== helpers_1.adminEmail) {
            throw new Error('Authentication error');
        }
        // @ts-ignore
        request.user = user;
    }
    catch (err) {
        reply.send(err);
    }
    // Go ahead
};
exports.AdminMiddleware = AdminMiddleware;
const ClientMiddleware = async (request, reply) => {
    try {
        const token = (request.headers.authorization || '').replace('Bearer ', '');
        if (!token) {
            throw new Error('Authentication error');
        }
        const user = await User_1.default.findActiveByToken(token);
        if (!user) {
            throw new Error('Authentication error');
        }
        // @ts-ignore
        request.user = user;
    }
    catch (err) {
        return reply.send(err);
    }
};
exports.ClientMiddleware = ClientMiddleware;
