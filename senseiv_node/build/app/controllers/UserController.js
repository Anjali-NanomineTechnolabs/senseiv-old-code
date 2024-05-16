"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const helpers_1 = require("../helpers/helpers");
const sequelize_1 = require("sequelize");
const bcrypt = require('bcrypt');
class UserController {
    static async getAll(req, res) {
        const users = await User_1.default.findAll({
            where: { email: { [sequelize_1.Op.ne]: helpers_1.adminEmail } },
            attributes: ['id', 'name', 'email', 'isActive'],
            order: [['id', 'DESC']]
        });
        return (0, helpers_1.jsonResponse)(users);
    }
    static async create({ body }, res) {
        if (!body.name) {
            return (0, helpers_1.jsonResponse)({}, false, 'name is required');
        }
        if (!body.email || !(0, helpers_1.isEmail)(body.email)) {
            return (0, helpers_1.jsonResponse)({}, false, 'email is required');
        }
        else if (await User_1.default.findOne({ where: { email: body.email } })) {
            return (0, helpers_1.jsonResponse)({}, false, 'email already exists');
        }
        if (!body.password || body.password.length < 6) {
            return (0, helpers_1.jsonResponse)({}, false, 'password is invalid');
        }
        if (!body.isActive || !['true', 'false'].includes(body.isActive)) {
            return (0, helpers_1.jsonResponse)({}, false, 'is active field is required');
        }
        if (!body.expiresAt || !(0, helpers_1.isDate)(body.expiresAt)) {
            return (0, helpers_1.jsonResponse)({}, false, 'Expiry date is required');
        }
        const user = await User_1.default.create({
            name: body.name,
            email: body.email,
            password: await bcrypt.hash(body.password, 10),
            isActive: body.isActive === 'true',
            expiresAt: new Date((0, helpers_1.now)(body.expiresAt)),
        });
        return (0, helpers_1.jsonResponse)({ id: user.id, name: user.name, email: user.email, isActive: user.isActive, expiresAt: user.expiresAt });
    }
    static async getOne(req, res) {
        const user = await User_1.default.findByPk(req.params.id);
        if (!user) {
            return (0, helpers_1.jsonResponse)({}, false, 'User not found');
        }
        if (user.email === helpers_1.adminEmail) {
            return (0, helpers_1.jsonResponse)({}, false, 'Cannot update admin user');
        }
        return (0, helpers_1.jsonResponse)(user);
    }
    static async update(req, res) {
        const user = await User_1.default.findByPk(req.params.id);
        if (!user) {
            return (0, helpers_1.jsonResponse)({}, false, 'User not found');
        }
        if (user.email === helpers_1.adminEmail) {
            return (0, helpers_1.jsonResponse)({}, false, 'Cannot update admin user');
        }
        if (req.body.name) {
            user.name = req.body.name;
        }
        if (req.body.email) {
            if (!(0, helpers_1.isEmail)(req.body.email)) {
                return (0, helpers_1.jsonResponse)({}, false, 'Email is invalid');
            }
            else if (await User_1.default.findOne({ where: { email: req.body.email, id: { [sequelize_1.Op.ne]: user.id } } })) {
                return (0, helpers_1.jsonResponse)({}, false, 'Email already exists');
            }
            user.email = req.body.email;
        }
        if (req.body.password) {
            if (req.body.password.length < 6) {
                return (0, helpers_1.jsonResponse)({}, false, 'Password is invalid');
            }
            user.password = await bcrypt.hash(req.body.password, 10);
        }
        if (req.body.isActive) {
            if (!['true', 'false'].includes(req.body.isActive)) {
                return (0, helpers_1.jsonResponse)({}, false, 'Is active field is required');
            }
            user.isActive = req.body.isActive === 'true';
        }
        if (req.body.expiresAt) {
            if (!(0, helpers_1.isDate)(req.body.expiresAt)) {
                return (0, helpers_1.jsonResponse)({}, false, 'Expiry date is required');
            }
            user.expiresAt = new Date(req.body.expiresAt);
        }
        await user.save();
        return (0, helpers_1.jsonResponse)({ id: user.id, name: user.name, email: user.email, isActive: user.isActive, expiresAt: user.expiresAt });
    }
    static async delete(req, res) {
        const user = await User_1.default.findByPk(req.params.id);
        if (!user) {
            return (0, helpers_1.jsonResponse)({}, false, 'User not found');
        }
        if (user.email === helpers_1.adminEmail) {
            return (0, helpers_1.jsonResponse)({}, false, 'Cannot delete admin user');
        }
        await user.destroy();
        return (0, helpers_1.jsonResponse)({}, true, 'User deleted successfully');
    }
}
exports.default = UserController;
