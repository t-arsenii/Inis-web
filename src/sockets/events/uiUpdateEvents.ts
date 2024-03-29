import { Server, Socket } from "socket.io";
import { GameState } from "../../core/gameState/GameState";
import { Player } from "../../core/Player";
import { GameStage } from "../../types/Enums";
import { io } from "../../initServer"
export function uiUpdateHandler(socket: Socket) {
    socket.on("game-update", () => {
        const gameState: GameState = socket.gameState!;
        gameState.uiUpdater.EmitGameUpdate();
    });
    socket.on("map-update", () => {
        const gameState: GameState = socket.gameState!;
        gameState.uiUpdater.EmitMapUpdate();
    })
    socket.on("sidebar-update", () => {
        const gameState: GameState = socket.gameState!;
        gameState.uiUpdater.EmitSidebarUpdate();
    })
    socket.on("my-deck-update", () => {
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        gameState.uiUpdater.EmitMyDeckUpdate(player);
    })
    socket.on("dealCards-update", () => {
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        try {
            if (gameState.gameStage !== GameStage.Gathering) {
                throw new Error("Game stage is not gathering");
            }
            gameState.uiUpdater.EmitDealCardUpdate(player);
        } catch (err) {
            console.log(err)
        }
    })
    socket.on("me-info", () => {
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        try {
            gameState.uiUpdater.EmitMeInfoUpdate(player);
        } catch (err) {
            console.log(err)
        }
    })
    socket.on("allPlayers-info", () => {
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        try {
            gameState.uiUpdater.EmitAllPlayersInfoUpdate(player);
        } catch (err) {
            console.log(err)
        }
    })
    socket.on("token-update", () => {
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        try {
            gameState.uiUpdater.EmitPretenderTokenUpdate(player);
        } catch (err) {
            console.log(err)
        }
    })
    socket.on("all-messages", () => {
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        try {
            gameState.uiUpdater.EmitAllMessagesUpdate(player);
        } catch (err) {
            console.log(err)
        }
    })
    socket.on("is-active", () => {
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        try {
            gameState.uiUpdater.EmitIsActiveUpdate();
        } catch (err: any) {
            console.log(err.message);
        }
    })
    socket.on("fight-update", () => {
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        try {
            if (gameState.gameStage !== GameStage.Fight) {
                throw new Error("Cannot update UI, gameStage is not Fight");
            }
            gameState.uiUpdater.EmitFightUpdate();
        }
        catch (err: any) {
            console.log(err.message);
        }
    })
    socket.on("attackCycle-update", () => {
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        try {
            if (gameState.gameStage !== GameStage.Fight) {
                throw new Error("Cannot update UI, gameStage is not Fight");
            }
            gameState.uiUpdater.EmitAttackCycleUpdate();
        }
        catch (err: any) {
            console.log(err.message);
        }
    })
}