import { Server, Socket } from "socket.io";
import { gamesManager } from "../core/GameStateManager";
import { Player } from "../core/Player";
import { cardActionsMap } from "../constans/constans_cards";
import { GameState } from "../core/GameState";
import { Console } from "console";
import { playerInfo } from "../core/GameStateManager";
import { axialCoordiantes } from "../types/Types";
import { gameLobbyHandler } from "./events/gameLobbyEvents";
export default function handleSocketConnections(io: Server) {
    io.on('connection', (socket: Socket) => {
        gameLobbyHandler(socket)
        socket.on("territory-put", (gameId, userId, { q, r }, territoryId) => {
            const gameState = gamesManager.getGame(gameId)
            const player = gameState?.GetPlayerById(userId)
            const axial: axialCoordiantes = {
                q: +q,
                r: +r
            }
            const isTerritory = gameState?.map.AddField(axial)
            console.log(`Is Territory(${q},${r}) placed: ${isTerritory}`)
        })
        socket.on("territory-all", (gameId, userId) => {
            const gameState = gamesManager.getGame(gameId)
            const player = gameState?.GetPlayerById(userId)
            socket.emit("territory-all", gameState?.map.ToJSON())
        })
        socket.on("territory-avaliable", (gameId, userId) => {
            const gameState = gamesManager.getGame(gameId)
            const player = gameState?.GetPlayerById(userId)
            socket.emit("territory-avaliable", gameState?.map.GetAllValidPlacements())
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