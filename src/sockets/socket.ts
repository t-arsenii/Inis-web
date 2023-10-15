import { Server, Socket } from "socket.io";
import { gamesManager } from "../core/GameStateManager";
import { Player } from "../core/Player";
import { cardActionMap } from "../core/constans/constant_action_cards";
import { GameState } from "../core/GameState";
import { playerInfo } from "../types/Types";
import { axialCoordiantes } from "../types/Types";
import { gameLobbyHandler } from "./events/gameLobbyEvents";
import { CheckSocketGameConnection } from "../services/helperFunctions";
import { gameSetupHandler } from "./events/gameSetupEvents";
import { playerCardHandler } from "./events/playerGameEvents";
import { HexGridToJson } from "../services/HexGridService";
import { playerFightHandler } from "./events/playerFightEvents";
import { DebugTools } from "./events/debugEvents";
export default function handleSocketConnections(io: Server) {
    //Maybe make middleware to retrive token data from user and also gameId from querry string,
    //to assosiate socket with game and user, in theory gives performance boost 
    // if (!CheckSocketGameConnection(socket, gameId)) {
    //     return
    // }
    // const res = GetGameStateAndPlayer(socket, gameId, playerId)
    // if (res === undefined) {
    //     return
    // }
    // const { gameState, player } = res
    io.on('connection', (socket: Socket) => {
        socket.use((packet, next) => {
            if (packet[0] === 'gameLobby-join') {
                return next()
            }
            const pInf: playerInfo | undefined = gamesManager.getSocketInfo(socket.id)
            if (!pInf) {
                console.log("Socket not found")
                return next(new Error("Socket not found"))
            }
            socket.gameState = pInf.gameState
            socket.player = pInf.player
            return next();
        });
        DebugTools(socket)
        gameLobbyHandler(socket)
        gameSetupHandler(socket)
        playerCardHandler(socket)
        playerFightHandler(socket)
        socket.on("territory-put", (gameId, userId, { q, r }, territoryId) => {
            const gameState = gamesManager.getGame(gameId)
            const player = gameState?.GetPlayerById(userId)
            const axial: axialCoordiantes = {
                q: +q,
                r: +r
            }
            const isTerritory = gameState?.map.fieldsController.AddRandomField(axial)
            socket.emit("territory-info", `Is Territory(${q},${r}) placed: ${isTerritory}`)
        })
        socket.on("player-nextTurn", () => {
            const gameState: GameState = socket.gameState!
            const player: Player = socket.player!
            if (player.id !== gameState.turnOrder.activePlayerId) {
                return
            }
            gameState.NextTurn()
        });
    });
}