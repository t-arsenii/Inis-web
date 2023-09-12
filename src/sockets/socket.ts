import { Server, Socket } from "socket.io";
import { gamesManager } from "../GameLogic/GameStateManager";
import { Player } from "../models/Player";
import { cardMap } from "../GameLogic/Constans/constans_cards";
import { GameState } from "../GameLogic/GameState";
import { Console } from "console";
import { playerInfo } from "../GameLogic/GameStateManager";

export default function handleSocketConnections(io: Server) {
    io.on('connection', (socket: Socket) => {
        socket.on("join-game", (userId: string, gameId: string) => {
            const gameState: GameState | undefined = gamesManager.getGame(gameId);
            if (!gameState) {
                socket.emit('join-game-error', { status: "failed", message: `Game with id: ${gameId}, is not found` })
                return
            }

            socket.join(gameId);
            const player: Player | undefined = gameState?.getPlayerById(userId)
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
            //console.log('A user disconnected.');
        });
        socket.on("init-game", (gameId) => {
            const gameState: GameState | undefined = gamesManager.getGame(gameId);
            if (!gameState) {
                return
            }
            try {
                gameState.initGame()
            }
            catch (err) {
                console.log(err)
                return
            }
        })
        socket.on("territory-place", (gameId, userId, { q, r }) => {
            const gameState = gamesManager.getGame(gameId)
            const player = gameState?.getPlayerById(userId)
            const isTerritory = gameState?.map.addHexagon(+q, +r)
            console.log(`Is Territory(${q},${r}) placed: ${isTerritory}`)
        })
        socket.on("territory-all", (gameId, userId) => {
            const gameState = gamesManager.getGame(gameId)
            const player = gameState?.getPlayerById(userId)
            socket.emit("territory-all", gameState?.map.toJSON())
        })
        socket.on("territory-avaliable", (gameId, userId) => {
            const gameState = gamesManager.getGame(gameId)
            const player = gameState?.getPlayerById(userId)
            socket.emit("territory-avaliable", gameState?.map.getAllValidPlacements())
        })
        socket.on("next-turn", (gameId, userId) => {
            const gameState = gamesManager.getGame(gameId)!
            const player = gameState.getPlayerById(userId)!
            if (gameState.turnOrder.activePlayerId !== player.Id)
            {
                console.log("Socket not allowed")
                socket.emit("next-turn", gameState.turnOrder)
                return
            }
            gameState.nextTurn()
            socket.emit("next-turn", gameState.turnOrder)
        })
        // socket.on("card-event", (cardId: string, gameId: string) => {
        //     console.log(`card-event room id: ${gameId}`);
        //     socket.to(gameId).emit("card-event-server", `Player ${socket.id} played card: ${cardDictionary[cardId].title}`);
        // });
    });
}