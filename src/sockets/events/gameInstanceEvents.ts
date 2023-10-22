import { Server, Socket } from "socket.io";
import { Player } from "../../core/Player";
import { GetGameStateAndPlayer } from "../../utils/helperFunctions";
import { playerInfo } from "../../types/Types"
import { GameState } from "../../core/gameState/GameState";
import { gamesManager } from "../../core/gameState/GameStateManager";
export function gameLobbyHandler(io: Server, socket: Socket) {
    socket.on("game-join", (gameId: string, userId: string) => {
        const res = GetGameStateAndPlayer(socket, gameId, userId)
        if (res === undefined) {
            return
        }
        const { gameState, player } = res
        socket.join(gameState.id);
        player.socket = socket;
        gamesManager.addSocketInfo(socket.id, player, gameState);
        socket.emit('gameLobby-info', { status: "success", info: { playerId: player.id, socket: socket.id, gameId: gameId } });
    });
    socket.on('disconnect', () => {
        if (!gamesManager.socketsConnInfo.has(socket.id)) {
            return;
        }
        const playerInfo: playerInfo | undefined = gamesManager.socketsConnInfo.get(socket.id);
        if (!playerInfo) {
            return;
        }
        const gameState: GameState = playerInfo.gameState;
        const player: Player = playerInfo.player;

        player.socket = null;
        gamesManager.removeSocketInfo(socket.id);
    });
    socket.on("game-init", (gameId) => {
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