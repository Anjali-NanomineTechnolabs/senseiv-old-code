"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserController_1 = __importDefault(require("../controllers/UserController"));
const AdminMiddleware_1 = require("../middlewares/AdminMiddleware");
const LoginController_1 = __importDefault(require("../controllers/LoginController"));
const SymbolController_1 = __importDefault(require("../controllers/SymbolController"));
const SettingController_1 = __importDefault(require("../controllers/SettingController"));
const APIRoutes = [
    {
        method: 'GET',
        url: '/ping',
        handler: async (request, reply) => {
            return 'PONG';
        }
    },
    {
        method: 'POST',
        url: '/api/login',
        handler: LoginController_1.default.login
    },
    {
        method: 'POST',
        url: '/api/logout',
        handler: LoginController_1.default.logout,
        preHandler: [AdminMiddleware_1.ClientMiddleware]
    },
    {
        method: 'POST',
        url: '/api/verify-token',
        handler: LoginController_1.default.verifyToken,
        preHandler: [AdminMiddleware_1.ClientMiddleware],
    },
    {
        method: 'GET',
        url: '/api/symbols',
        handler: SymbolController_1.default.getSymbols,
        preHandler: [AdminMiddleware_1.ClientMiddleware],
    },
    {
        method: 'GET',
        url: '/api/symbol/alerts/:symbol?',
        handler: SymbolController_1.default.getAlerts,
        preHandler: [AdminMiddleware_1.ClientMiddleware],
    },
    {
        method: 'GET',
        url: '/api/symbol/alerts/history/:symbol?',
        handler: SymbolController_1.default.getAlertsHistory,
        preHandler: [AdminMiddleware_1.ClientMiddleware],
    },
    // User CRUD routes
    {
        method: 'GET',
        url: '/api/users',
        handler: UserController_1.default.getAll,
        preHandler: [AdminMiddleware_1.AdminMiddleware]
    },
    {
        method: 'POST',
        url: '/api/users',
        handler: UserController_1.default.create,
        preHandler: [AdminMiddleware_1.AdminMiddleware]
    },
    {
        method: 'GET',
        url: '/api/users/:id',
        handler: UserController_1.default.getOne,
        preHandler: [AdminMiddleware_1.AdminMiddleware]
    },
    {
        method: 'PUT',
        url: '/api/users/:id',
        handler: UserController_1.default.update,
        preHandler: [AdminMiddleware_1.AdminMiddleware]
    },
    {
        method: 'DELETE',
        url: '/api/users/:id',
        handler: UserController_1.default.delete,
        preHandler: [AdminMiddleware_1.AdminMiddleware]
    },
    // settings routes
    {
        method: 'GET',
        url: '/api/settings',
        handler: SettingController_1.default.getAll,
        preHandler: [AdminMiddleware_1.AdminMiddleware]
    },
    {
        method: 'PUT',
        url: '/api/settings/:id',
        handler: SettingController_1.default.update,
        preHandler: [AdminMiddleware_1.AdminMiddleware]
    },
    {
        method: 'POST',
        url: '/api/trigger-high-swap',
        handler: SettingController_1.default.triggerHighSwap,
        preHandler: [AdminMiddleware_1.AdminMiddleware]
    }
];
exports.default = APIRoutes;
