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
export default function handleSocketConnections(io: Server) {
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
            
            return next();
        });
        
        DebugTools(io, socket);
        gameLobbyHandler(io, socket);
        gameSetupHandler(io, socket);
        playerGameHandler(io, socket);
        playerFightHandler(io, socket);
        uiUpdateHandler(io, socket);

        socket.on("territory-put", (gameId, userId, { q, r }, territoryId) => {
            const gameState = gamesManager.getGame(gameId);
            const player = gameState?.playerManager.GetPlayerById(userId);
            const axial: axialCoordinates = {
                q: +q,
                r: +r
            }
            const isTerritory = gameState?.hexGridManager.fieldsController.AddRandomField(axial)
            socket.emit("territory-info", `Is Territory(${q},${r}) placed: ${isTerritory}`)
        })
        socket.on("player-nextTurn", () => {
            const gameState: GameState = socket.gameState!
            const player: Player = socket.player!
            if (player.id !== gameState.turnOrderManager.GetActivePlayer()!.id) {
                return
            }
            gameState.turnOrderManager.NextTurn();
        });
    });
}