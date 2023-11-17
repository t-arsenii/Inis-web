import { Server, Socket } from "socket.io";
import { Player } from "../../core/Player";
import { GetGameStateAndPlayer } from "../../utils/helperFunctions";
import { playerInfo } from "../../types/Types"
import { GameState } from "../../core/gameState/GameState";
import { gamesManager } from "../../core/gameState/GameStateManager";
import jwt, { JwtPayload } from "jsonwebtoken";

export function gameLobbyHandler(io: Server, socket: Socket) {
    socket.on("game-join", (gameId: string, tokenInput: string) => {
        const token = (tokenInput || "").replace(/Bearer\s?/, "");
        let userId: string = "";
        if (!token) {
            return;
        }
        try {
            const decoded: JwtPayload = jwt.verify(token, "secret123") as JwtPayload;;
            userId = decoded._id;
        } catch (e) {
            console.log(e);
            return;
        }
        console.log(userId)
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
}