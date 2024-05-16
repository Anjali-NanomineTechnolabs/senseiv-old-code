"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers/helpers");
const Setting_1 = __importDefault(require("../models/Setting"));
class SettingController {
    static async getAll() {
        return (0, helpers_1.jsonResponse)(await Setting_1.default.findAll() || []);
    }
    static async triggerHighSwap(request) {
        if (!request.body.type) {
            return (0, helpers_1.jsonResponse)({}, false, 'Type is required');
        }
        const type = request.body.type;
        return (0, helpers_1.jsonResponse)({}, true, 'High swap triggered');
    }
    static async update(request) {
        if (!request.body.name) {
            return (0, helpers_1.jsonResponse)({}, false, 'Name is required');
        }
        if (!request.body.value) {
            return (0, helpers_1.jsonResponse)({}, false, 'Value is required');
        }
        const name = request.body.name;
        const value = request.body.value;
        await Setting_1.default.update({ value }, { where: { name } });
        const settings = await Setting_1.default.findAll();
        return (0, helpers_1.jsonResponse)(settings, true, 'Setting updated');
    }
}
exports.default = SettingController;
