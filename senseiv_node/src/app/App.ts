import fastify, {FastifyInstance, RouteOptions} from "fastify";
import APIRoutes from "./routes/api";
import {Server, Socket} from "socket.io";
import {SocketClientMiddleware} from "./middlewares/SocketMiddleware";
import {now} from "./helpers/helpers";

class App {
    public server: FastifyInstance = fastify({logger: true});
    public socketIO: Server = new Server(this.server.server, {
        cors: {origin: "*"},
        transports: ["websocket"],
        allowUpgrades: false
    });
    private readonly port: number;

    constructor() {
        this.port = parseInt(process.env.APP_PORT || '') || 4040;
        this.addPlugins();
        this.addMiddlewares()
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.server.get('/', async () => {
            return {hello: 'world'}
        })

        APIRoutes.forEach((route) => {
            // @ts-ignore
            this.server.route(route)
        })
    }

    addMiddlewares() {
        this.server.setErrorHandler((error, request, reply) => {
            console.error({
                date: now(),
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
            })
            reply.send({error: error.message || "Something went wrong", success: false})
        })
        this.server.addHook('onClose', (instance, done) => {
            this.socketIO.close()
            done()
        })

        // socket authentication middleware
        this.socketIO.use(SocketClientMiddleware)
    }

    private addPlugins() {
        // fastify http server
        this.server.register(require('@fastify/cors'), {
            origin: '*',
            methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        })

        // fastify http server
        this.server.ready((err) => {
            if (err) throw err;

            // socket connections
            this.socketIO.on('connection', (socket: Socket) => {
                socket.on("join", (room: string) => socket.join(room));
                socket.on("leave", (room: string) => socket.leave(room));
            })
        })
    }

    start() {
        this.server.listen({port: this.port}, (err, address) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            console.log(`Server listening at ${address}`);
        })
    }
}

export default App;