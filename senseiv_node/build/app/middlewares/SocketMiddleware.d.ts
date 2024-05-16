import { Socket } from "socket.io";
export declare const SocketClientMiddleware: (socket: Socket, next: any) => Promise<void>;
