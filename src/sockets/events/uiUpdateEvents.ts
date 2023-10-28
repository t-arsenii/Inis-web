import { Server, Socket } from "socket.io";
import { GameState } from "../../core/gameState/GameState";
import { Player } from "../../core/Player";
import { GameStage } from "../../types/Enums";

export function uiUpdateHandler(io: Server, socket: Socket) {
    socket.on("game-update", () => {
        const gameState: GameState = socket.gameState!;
        io.to(gameState.id).emit("game-update", gameState.uiUpdater.getGameUiInfo());
    });
    socket.on("map-update", () => {
        const gameState: GameState = socket.gameState!;
        io.to(gameState.id).emit("map-update", gameState.uiUpdater.getMapUiInfo());
    })
    socket.on("sidebar-update", () => {
        const gameState: GameState = socket.gameState!;
        io.to(gameState.id).emit("sidebar-update", gameState.uiUpdater.getSidebarUiInfo());
    })
    socket.on("my-deck-update", () => {
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        socket.emit("my-deck-update", gameState.uiUpdater.getMyDeckUiInfo(player));
    })
    socket.on("dealCards-update", () => {
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        try {
            if (gameState.gameStage !== GameStage.Gathering) {
                throw new Error("Game stage is not gathering");
            }
            player.socket!.emit("dealCards-update", gameState.uiUpdater.getDealCardUiInfo(player));
        } catch (err) {
            console.log(err)
        }
    })
}