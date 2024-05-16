"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Load environment variables from .env file
const App_1 = __importDefault(require("./app/App"));
const Database_1 = __importDefault(require("./app/database/Database"));
// Initialize axios interceptors
require("./app/helpers/axios");
const SenseIV_1 = __importDefault(require("./app/socket/SenseIV"));
require('dotenv').config();
// create database connection
const connection = Database_1.default.getConnection();
// start fastify http server
const app = new App_1.default();
app.start();
const senseIV = new SenseIV_1.default(app);
senseIV.start();
