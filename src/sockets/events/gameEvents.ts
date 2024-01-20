import { Server, Socket } from "socket.io";
import { Player } from "../../core/Player";
import { GetGameStateAndPlayer } from "../../utils/helperFunctions";
import { PlayerInfoType } from "../../types/Types"
import { GameState } from "../../core/gameState/GameState";
import { gamesManager } from "../../core/gameState/GameStateManager";
import jwt, { JwtPayload } from "jsonwebtoken";
import { io } from "../../initServer"

export function gameLobbyHandler(socket: Socket) {
    socket.on("game-join", (gameId: string, tokenInput: string) => {
        const token = (tokenInput || "").replace(/Bearer\s?/, "");
        let userId: string = "";
        if (!token) {
            console.log("Token error\n");
            return;
        }
        try {
            const decoded: JwtPayload = jwt.verify(token, "secret123") as JwtPayload;
            userId = decoded._id;
        } catch (e) {
            console.log("Token error\n", e);
            return;
        }
        const res = GetGameStateAndPlayer(socket, gameId, userId)
        if (res === undefined) {
            return
        }
        const { gameState, player } = res
        socket.join(gameState.id);
        player.socket = socket;
        gamesManager.addSocketInfo(socket.id, player, gameState);
        socket.gameState = gameState;
        socket.player = player;
        socket.auth = true;
        console.log("User: ", userId, ", joined to game: ", gameId);
        socket.emit('gameLobby-info', { status: "success", info: { playerId: player.id, socket: socket.id, gameId: gameId } });
    });
    socket.on('disconnect', () => {
        if (!gamesManager.socketsConnInfo.has(socket.id)) {
            return;
        }
        const playerInfo: PlayerInfoType | undefined = gamesManager.socketsConnInfo.get(socket.id);
        if (!playerInfo) {
            return;
        }
        const gameState: GameState = playerInfo.gameState;
        const player: Player = playerInfo.player;

        player.socket = null;
        gamesManager.removeSocketInfo(socket.id);
    });
}