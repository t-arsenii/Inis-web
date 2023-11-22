import cors from "cors";
import express from "express";
import http from 'http';
import { Server } from "socket.io"
const initServer = () => {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:3000", "http://localhost:8080", "http://localhost:4444"]
        }
    });
    app.use(express.json());
    app.use(cors({
        origin: ['http://localhost:3000', "http://localhost:4444", "http://localhost:8080"]
    }));

    return { app, server, io };
};
const { app, server, io } = initServer();
export { app, server, io };