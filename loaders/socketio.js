import { Server } from "socket.io";


export async function init (server) {
    const io = new Server(server);
    return io;
}