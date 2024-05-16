import UserController from "../controllers/UserController";
import {FastifyReply, FastifyRequest, RouteOptions} from "fastify";
import {AdminMiddleware, ClientMiddleware} from "../middlewares/AdminMiddleware";
import LoginController from "../controllers/LoginController";
import SymbolController from "../controllers/SymbolController";
import SettingController from "../controllers/SettingController";

const APIRoutes = [
    {
        method: 'GET',
        url: '/ping',
        handler: async (request: FastifyRequest, reply: FastifyReply) => {
            return 'PONG'
        }
    },
    {
        method: 'POST',
        url: '/api/login',
        handler: LoginController.login
    },
    {
        method: 'POST',
        url: '/api/logout',
        handler: LoginController.logout,
        preHandler: [ClientMiddleware]
    },
    {
        method: 'POST',
        url: '/api/verify-token',
        handler: LoginController.verifyToken,
        preHandler: [ClientMiddleware],
    },
    {
        method: 'GET',
        url: '/api/symbols',
        handler: SymbolController.getSymbols,
        preHandler: [ClientMiddleware],
    },
    {
        method: 'GET',
        url: '/api/symbol/alerts/:symbol?',
        handler: SymbolController.getAlerts,
        preHandler: [ClientMiddleware],
    },
    {
        method: 'GET',
        url: '/api/symbol/alerts/history/:symbol?',
        handler: SymbolController.getAlertsHistory,
        preHandler: [ClientMiddleware],
    },

    // User CRUD routes
    {
        method: 'GET',
        url: '/api/users',
        handler: UserController.getAll,
        preHandler: [AdminMiddleware]
    },
    {
        method: 'POST',
        url: '/api/users',
        handler: UserController.create,
        preHandler: [AdminMiddleware]
    },
    {
        method: 'GET',
        url: '/api/users/:id',
        handler: UserController.getOne,
        preHandler: [AdminMiddleware]
    },
    {
        method: 'PUT',
        url: '/api/users/:id',
        handler: UserController.update,
        preHandler: [AdminMiddleware]
    },
    {
        method: 'DELETE',
        url: '/api/users/:id',
        handler: UserController.delete,
        preHandler: [AdminMiddleware]
    },

    // settings routes
    {
        method: 'GET',
        url: '/api/settings',
        handler: SettingController.getAll,
        preHandler: [AdminMiddleware]
    },
    {
        method: 'PUT',
        url: '/api/settings/:id',
        handler: SettingController.update,
        preHandler: [AdminMiddleware]
    },
    {
        method: 'POST',
        url: '/api/trigger-high-swap',
        handler: SettingController.triggerHighSwap,
        preHandler: [AdminMiddleware]
    }
]

export default APIRoutes