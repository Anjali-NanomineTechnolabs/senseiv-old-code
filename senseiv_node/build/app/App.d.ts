import { FastifyInstance } from "fastify";
import { Server } from "socket.io";
declare class App {
    server: FastifyInstance;
    socketIO: Server;
    private readonly port;
    constructor();
    initializeRoutes(): void;
    addMiddlewares(): void;
    private addPlugins;
    start(): void;
}
export default App;
