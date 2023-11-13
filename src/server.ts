import express, { Express, Request, Response } from "express"
import { Server, Socket } from "socket.io"
import http from 'http';
import cors from 'cors';
import gamesRoutes from "./routes/gamesRoutes"
import handleSocketConnections from "./sockets/socket"
import { initGameToGathering, initGameToSeason } from "./utils/debugTools";
require('dotenv').config();
const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:8080"]
    }
});
app.use(express.json());

handleSocketConnections(io);

app.use(cors({
    origin: ['http://localhost:3000', "http://localhost:4444", "http://localhost:8080"]
}));

app.use("/", gamesRoutes);


server.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`)
});

initGameToSeason();
// initGameToGathering();