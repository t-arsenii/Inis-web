import { Server, Socket } from "socket.io";
import { Player } from "../core/Player";
import { cardActionMap } from "../core/constans/constant_action_cards";
import { playerInfo } from "../types/Types";
import { axialCoordinates } from "../types/Types";
import { gameLobbyHandler } from "./events/gameEvents";
import { CheckSocketGameConnection } from "../utils/helperFunctions";
import { gameSetupHandler } from "./events/gameSetupEvents";
import { playerGameHandler } from "./events/playerGameEvents";
import { HexGridToJson } from "../utils/HexGridUtils";
import { playerFightHandler } from "./events/playerFightEvents";
import { DebugTools } from "./events/debugEvents";
import { GameState } from "../core/gameState/GameState";
import { gamesManager } from "../core/gameState/GameStateManager";
import { uiUpdateHandler } from "./events/uiUpdateEvents";
import { RedisClientType } from "redis";
import { RedisConverter } from "../core/RedisConverter";
import { GameStage } from "../types/Enums";
import { io } from "../initServer"
import { chatEvents } from "./events/chatEvents";

export default function handleSocketConnections() {
    //Maybe make middleware to retrive token data from user and also gameId from querry string,
    //to assosiate socket with game and user, in theory gives performance boost 
    io.on('connection', (socket: Socket) => {
        //middlewares 
        socket.use((packet, next) => {
            if (packet[0] === 'game-join' || packet[0] === 'game-join-id') {
                return next();
            }
            if (!socket.auth) {
                console.log("Socket not found");
                return next(new Error("Socket not found"));
            }
            if (!socket.gameState) {
                return next(new Error("Internal server error"));
            }
            if (!socket.player) {
                return next(new Error("Internal server error"));
            }
            const gameState: GameState = socket.gameState;
            const player: Player = socket.player;
            if (!gameState.gameStatus) {
                return next(new Error("Game status is false"));
            }
            return next();
        });

        DebugTools(socket);
        gameLobbyHandler(socket);
        gameSetupHandler(socket);
        playerGameHandler(socket);
        playerFightHandler(socket);
        uiUpdateHandler(socket);
        chatEvents(socket);
        
    });
}