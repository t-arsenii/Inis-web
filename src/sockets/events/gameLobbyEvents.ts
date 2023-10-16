import { Server, Socket } from "socket.io";
import { GameState } from "../../gameState/GameState";
import { gamesManager } from "../../gameState/GameStateManager";
import { Player } from "../../core/Player";
import { GetGameStateAndPlayer } from "../../services/helperFunctions";
import { playerInfo } from "../../types/Types"
export function gameLobbyHandler(socket: Socket) {
    socket.on("gameLobby-join", (gameId: string, userId: string) => {
        const res = GetGameStateAndPlayer(socket, gameId, userId)
        if (res === undefined) {
            return
        }
        const { gameState, player } = res
        socket.join(gameId);
        player.socket = socket
        gamesManager.socketsConnInfo.set(socket.id, { gameState: gameState, player: player })
        socket.emit('gameLobby-info', { status: "success", info: { playerId: player.id, socket: socket.id, gameId: gameId } })
    });
    socket.on('disconnect', () => {
        if (!gamesManager.socketsConnInfo.has(socket.id)) {
            return
        }
        const playerInfo: playerInfo | undefined = gamesManager.socketsConnInfo.get(socket.id)
        if (!playerInfo) {
            return
        }
        const gameState: GameState = playerInfo.gameState
        const player: Player = playerInfo.player

        player.socket = null
        gamesManager.socketsConnInfo.delete(socket.id)
    });
    socket.on("gameLobby-init", (gameId) => {
        const gameState: GameState | undefined = gamesManager.getGame(gameId);
        if (!gameState) {
            return
        }
        try {
            gameState.Init()
        }
        catch (err) {
            console.log(err)
            return
        }
        socket.emit("gameLobby-info", `game with id ${gameState.id} was initialized`)
    })
}