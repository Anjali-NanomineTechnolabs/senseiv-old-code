"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const api_1 = __importDefault(require("./routes/api"));
const socket_io_1 = require("socket.io");
const SocketMiddleware_1 = require("./middlewares/SocketMiddleware");
const helpers_1 = require("./helpers/helpers");
class App {
    server = (0, fastify_1.default)({ logger: true });
    socketIO = new socket_io_1.Server(this.server.server, {
        cors: { origin: "*" },
        transports: ["websocket"],
        allowUpgrades: false
    });
    port;
    constructor() {
        this.port = parseInt(process.env.APP_PORT || '') || 4040;
        this.addPlugins();
        this.addMiddlewares();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.server.get('/', async () => {
            return { hello: 'world' };
        });
        api_1.default.forEach((route) => {
            // @ts-ignore
            this.server.route(route);
        });
    }
    addMiddlewares() {
        this.server.setErrorHandler((error, request, reply) => {
            console.error({
                date: (0, helpers_1.now)(),
                error: error.message,
                cause: error.cause,
                stack: error.stack,
                method: request.method,
                url: request.url,
                ip: request.ip,
                hostname: request.hostname,
                body: request.body,
                query: request.query,
                params: request.params,
                headers: request.headers
            });
            reply.send({ error: error.message || "Something went wrong", success: false });
        });
        this.server.addHook('onClose', (instance, done) => {
            this.socketIO.close();
            done();
        });
        // socket authentication middleware
        this.socketIO.use(SocketMiddleware_1.SocketClientMiddleware);
    }
    addPlugins() {
        // fastify http server
        this.server.register(require('@fastify/cors'), {
            origin: '*',
            methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        });
        // fastify http server
        this.server.ready((err) => {
            if (err)
                throw err;
            // socket connections
            this.socketIO.on('connection', (socket) => {
                socket.on("join", (room) => socket.join(room));
                socket.on("leave", (room) => socket.leave(room));
            });
        });
    }
    start() {
        this.server.listen({ port: this.port }, (err, address) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            console.log(`Server listening at ${address}`);
        });
    }
}
exports.default = App;
