import { Socket } from "socket.io";
import { GameState } from "../core/gameState/GameState";
import { Player } from "../core/Player";
import { GameStage, playerAction } from "../types/Enums";
import { checkAllPlayersPass } from "./gameStateUtils";

function handlePlayerPass(socket: Socket) {
    const gameState: GameState = socket.gameState!;
    const player: Player = socket.player!;
    try {
        if (!player.isActive) {
            throw new Error("PlayerPass: player is not active")
        }
        if (gameState.gameStage !== GameStage.Season) {
            throw new Error("PlayerPass: Game stage is not Season");
        }
        gameState.turnOrderManager.NextTurn();
        player.lastAction = playerAction.Pass;

        const nextPlayer = gameState.turnOrderManager.GetActivePlayer();
        gameState.uiUpdater.EmitPretenderTokenUpdate(nextPlayer);
        if (checkAllPlayersPass(gameState.playerManager.GetPlayers())) {
            gameState.EndSeasonStage();
            gameState.StartGatheringStage();
            gameState.uiUpdater.EmitGameUpdate()
        }
        gameState.uiUpdater.EmitSidebarUpdate();
    } catch (err) {
        throw err;
    }
}

export { handlePlayerPass }