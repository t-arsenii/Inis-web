import express, { Express, Request, Response } from "express"
import { Server, Socket } from "socket.io"
import http from 'http';
import cors from 'cors';
import { GameState } from "./core/GameState";
import { v4 } from "uuid"
import { Player } from "./core/Player";
import { cardActionMap } from "./constans/constant_action_cards";
import { gamesManager } from "./core/GameStateManager";
import gamesRoutes from "./routes/gamesRoutes"
import handleSocketConnections from "./sockets/socket"
import { initData } from "./services/helperFunctions";
const PORT = 8000

const app = express()
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:8080"]
    }
})
app.use(express.json());

handleSocketConnections(io)

app.use(cors({
    origin: 'http://localhost:8080'
}));

app.use("/", gamesRoutes)

server.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`)
})
initData()