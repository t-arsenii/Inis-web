import express, { Express, Request, Response } from "express"
import { Server, Socket } from "socket.io"
import http from 'http';
import cors from 'cors';
import gamesRoutes from "./routes/gamesRoutes"
import handleSocketConnections from "./sockets/socket"
import { initGameToGathering, initGameToSeason, initGameToSetup } from "./utils/debugTools";
import { app, server, io } from "./initServer"
require('dotenv').config();
const PORT = process.env.PORT || 8000;

handleSocketConnections(io);

app.use("/", gamesRoutes);

server.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`)
});
initGameToSetup();
initGameToSeason();
// initGameToGathering();