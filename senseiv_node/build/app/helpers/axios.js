"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
axios_1.default.interceptors.request.use((config) => {
    config.headers['Accept'] = 'application/json';
    config.headers['Content-Type'] = 'application/json';
    return config;
});
axios_1.default.interceptors.response.use((response) => {
    return response.data;
}, (error) => {
    return Promise.reject(error);
});
exports.default = axios_1.default;
