import { io, Socket } from "socket.io-client";

export const socketClient : Socket = io("http://localhost:8000");