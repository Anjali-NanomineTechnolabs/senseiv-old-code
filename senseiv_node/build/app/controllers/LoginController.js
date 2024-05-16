"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers/helpers");
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt = require('bcrypt');
class LoginController {
    static async login(request, response) {
        if (!request.body.email) {
            return (0, helpers_1.jsonResponse)({}, false, 'Email is required');
        }
        if (!request.body.password) {
            return (0, helpers_1.jsonResponse)({}, false, 'Password is required');
        }
        const user = await User_1.default.findOne({ where: { email: request.body.email } });
        if (!user) {
            return (0, helpers_1.jsonResponse)({}, false, 'Email does not exists');
        }
        if (user.isLoggedIn) {
            return (0, helpers_1.jsonResponse)({}, false, 'User is already logged in');
        }
        const match = await bcrypt.compare(request.body.password, user.password);
        if (!match) {
            return (0, helpers_1.jsonResponse)({}, false, 'Password is incorrect');
        }
        if (!user.isActive) {
            return (0, helpers_1.jsonResponse)({}, false, 'User is not active');
        }
        if ((0, helpers_1.now)(user.expiresAt) < (0, helpers_1.now)()) {
            return (0, helpers_1.jsonResponse)({}, false, 'User is expired');
        }
        // create new token
        const token = (0, jsonwebtoken_1.sign)(user.toJSON(), process.env.JWT_SECRET || '');
        // mark the user loggedIn
        await User_1.default.update({ isLoggedIn: true, token }, { where: { id: user.id } });
        return (0, helpers_1.jsonResponse)({
            token, user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isActive: user.isActive,
                expiresAt: user.expiresAt,
                isAdmin: user.email === process.env.ADMIN_EMAIL
            }
        });
    }
    static async logout(request, response) {
        console.log(request.user);
        const user = request.user;
        if (!user) {
            return (0, helpers_1.jsonResponse)({}, false, 'User not found');
        }
        user.isLoggedIn = false;
        user.token = null;
        user.save();
        return (0, helpers_1.jsonResponse)({}, true, 'User logged out');
    }
    static verifyToken(request, response) {
        const user = request.user;
        if (!user) {
            return (0, helpers_1.jsonResponse)({}, false, 'User not found');
        }
        return (0, helpers_1.jsonResponse)({}, true, 'Success');
    }
}
exports.default = LoginController;
