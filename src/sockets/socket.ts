import { Server, Socket } from "socket.io";
import { gamesManager } from "../core/GameStateManager";
import { Player } from "../core/Player";
import { cardActionsMap } from "../constans/constans_cards";
import { GameState } from "../core/GameState";
import { Console } from "console";
import { playerInfo } from "../types/Types";
import { axialCoordiantes } from "../types/Types";
import { gameLobbyHandler } from "./events/gameLobbyEvents";
import { CheckSocketGameConnection } from "../services/helperFunctions";
import { gameSetupHandler } from "./events/gameSetupEvents";
import { playerCardHandler } from "./events/playerCardEvents";
import { HexGridToJson } from "../services/HexGridService";
import { playerFightHandler } from "./events/playerFightEvents";
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
        socket.on("territory-all", () => {
            const gameState: GameState = socket.gameState!
            socket.emit("territory-info", HexGridToJson(gameState.map))
        })
        socket.on("territory-avaliable", () => {
            const gameState: GameState = socket.gameState!
            const player: Player = socket.player!
            socket.emit("territory-info", gameState?.map.GetAllValidPlacements())
        })
        socket.on("next-turn", (gameId, userId) => {
            const gameState = gamesManager.getGame(gameId)!
            const player = gameState.GetPlayerById(userId)!
            if (gameState.turnOrder.activePlayerId !== player.id) {
                return
            }
            gameState.NextTurn()
            socket.emit("next-turn", gameState.turnOrder)
        })
        socket.on("player-action", (actionType: string, gameId: string, userId: string) => {
            // console.log(`card-event room id: ${gameId}`);
            // socket.to(gameId).emit("card-event-server", `Player ${socket.id} played card: ${cardDictionary[cardId].title}`);
        });
    });
}