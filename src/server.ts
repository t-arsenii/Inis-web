import express, { Express, Request, Response } from "express"
import { Server, Socket } from "socket.io"
import http from 'http';
import cors from 'cors';
import gamesRoutes from "./routes/gamesRoutes"
import handleSocketConnections from "./sockets/socket"
import { initGameToGathering, initGameToSeason } from "./utils/debugTools";
const redis = require('redis');
require('dotenv').config();
const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"]
    }
});
app.use(express.json());

const redisClient = redis.createClient({
    host: 'localhost',
    port: process.env.REDIS_PORT || 6379, 
});

handleSocketConnections(io, redisClient);

app.use(cors({
    origin: ['http://localhost:3000']
}));

app.use("/", gamesRoutes);


server.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`)
});

initGameToSeason();
// initGameToGathering();