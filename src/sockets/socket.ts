import { Server, Socket } from "socket.io";
import { Player } from "../core/Player";
import { gameLobbyHandler } from "./events/gameEvents";
import { gameSetupHandler } from "./events/gameSetupEvents";
import { playerGameHandler } from "./events/playerGameEvents";
import { playerFightHandler } from "./events/playerFightEvents";
import { DebugTools } from "./events/debugEvents";
import { GameState } from "../core/gameState/GameState";
import { uiUpdateHandler } from "./events/uiUpdateEvents";
import { io } from "../initServer"
import { chatEventsHandler } from "./events/chatEvents";

export default function handleSocketConnections() {
    io.on('connection', (socket: Socket) => {
        socket.use((packet, next) => {
            if (packet[0] === 'game-join' || packet[0] === 'game-join-id') {
                return next();
            }
            if (!socket.auth) {
                console.error("Socket not found");
                return next(new Error("Socket not found"));
            }
            if (!socket.gameState) {
                return next(new Error("Internal server error"));
            }
            if (!socket.player) {
                return next(new Error("Internal server error"));
            }
            const gameState: GameState = socket.gameState;
            const player: Player = socket.player;
            if (!gameState.gameStatus) {
                return next(new Error("Game status is false"));
            }
            if (!gameState.isPaused) {
                return next();
            }
            if (packet[0] === 'pause') {
                return next();
            }
            console.error("Game is in paused state");
            return next(new Error("Game is in paused state"));
        });
        DebugTools(socket);
        gameLobbyHandler(socket);
        gameSetupHandler(socket);
        playerGameHandler(socket);
        playerFightHandler(socket);
        uiUpdateHandler(socket);
        chatEventsHandler(socket);
    });
}