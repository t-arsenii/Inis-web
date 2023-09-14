import { Server, Socket } from "socket.io";
import { gamesManager } from "../core/GameStateManager";
import { Player } from "../core/Player";
import { cardActionsMap } from "../constans/constans_cards";
import { GameState } from "../core/GameState";
import { Console } from "console";
import { playerInfo } from "../core/GameStateManager";

export default function handleSocketConnections(io: Server) {
    io.on('connection', (socket: Socket) => {
        socket.on("game-join", (userId: string, gameId: string) => {
            const gameState: GameState | undefined = gamesManager.getGame(gameId);
            if (!gameState) {
                socket.emit('join-game-error', { status: "failed", message: `Game with id: ${gameId}, is not found` })
                return
            }
            socket.join(gameId);
            const player: Player | undefined = gameState?.GetPlayerById(userId)
            if (!player) {
                socket.emit('join-game-error', { status: "failed", message: `Player with id: ${userId}, is not found in existing game: ${gameId}` })
                return
            }
            player.Socket = socket
            gamesManager.socketToGame.set(socket.id, { gameState: gameState, player: player })
            socket.emit('join-game-info', { status: "success", info: { playerId: player.Id, socket: socket.id, gameId: gameId } })
        });
        socket.on('disconnect', () => {
            if (!gamesManager.socketToGame.has(socket.id)) {
                return
            }
            const playerInfo: playerInfo | undefined = gamesManager.socketToGame.get(socket.id)
            if (!playerInfo) {
                return
            }
            const gameState: GameState = playerInfo.gameState
            const player: Player = playerInfo.player

            player.Socket = undefined
            gamesManager.socketToGame.delete(socket.id)
        });
        socket.on("game-init", (gameId) => {
            const gameState: GameState | undefined = gamesManager.getGame(gameId);
            if (!gameState) {
                return
            }
            try {
                gameState.InitGame()
            }
            catch (err) {
                console.log(err)
                return
            }
        })
        socket.on("territory-put", (gameId, userId, { q, r }, territoryId) => {
            const gameState = gamesManager.getGame(gameId)
            const player = gameState?.GetPlayerById(userId)
            const isTerritory = gameState?.map.addField(+q, +r)
            console.log(`Is Territory(${q},${r}) placed: ${isTerritory}`)
        })
        socket.on("territory-all", (gameId, userId) => {
            const gameState = gamesManager.getGame(gameId)
            const player = gameState?.GetPlayerById(userId)
            socket.emit("territory-all", gameState?.map.toJSON())
        })
        socket.on("territory-avaliable", (gameId, userId) => {
            const gameState = gamesManager.getGame(gameId)
            const player = gameState?.GetPlayerById(userId)
            socket.emit("territory-avaliable", gameState?.map.getAllValidPlacements())
        })
        socket.on("next-turn", (gameId, userId) => {
            const gameState = gamesManager.getGame(gameId)!
            const player = gameState.GetPlayerById(userId)!
            if (gameState.turnOrder.activePlayerId !== player.Id) {
                return
            }
            gameState.NextTurn()
            socket.emit("next-turn", gameState.turnOrder)
        })
        socket.on("player-action", (actionType: string, gameId: string, userId:string) => {
            // console.log(`card-event room id: ${gameId}`);
            // socket.to(gameId).emit("card-event-server", `Player ${socket.id} played card: ${cardDictionary[cardId].title}`);
        });
    });
}