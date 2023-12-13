import { Server, Socket } from "socket.io";
import { axialCoordinates } from "../../types/Types";
import { CheckSocketGameConnection, GetGameStateAndPlayer } from "../../utils/helperFunctions";
import { GameStage } from "../../types/Enums";
import { Player } from "../../core/Player";
import { GameState } from "../../core/gameState/GameState";
import { io } from "../../initServer"
export function gameSetupHandler(socket: Socket) {
    socket.on("game-setup-clans", async (axial: axialCoordinates) => {
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        try {
            if (!player.isActive) {
                throw new Error("GameSetupClans: player not active");
            }
            if (gameState.gameStage !== GameStage.ClansSetup) {
                throw new Error("GameSetupClans: game stage is not valid");
            }
            gameState.hexGridManager.clansController.AddClans(player, 1, axial);
            if (gameState.hexGridManager.setupController.SetupClans()) {
                gameState.turnOrderManager.NextTurn();
                await gameState.StartGatheringStage();
                return;
            }
            gameState.turnOrderManager.NextTurn()
        }
        catch (err) {
            socket.emit("game-setup-clans-error", `GameSetupClans: Internal server error:\n${err}`)
            console.log(err)
        }
    })
    socket.on("game-setup-capital", (axial: axialCoordinates) => {
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        try {
            if (!player.isBren || !player.isActive) {
                throw new Error("GameSetupCapital: player not active or not bren");
            }
            if (gameState.gameStage !== GameStage.CapitalSetup) {
                throw new Error("GameSetupCapital: game stage is not valid");
            }
            if (gameState.hexGridManager.fieldsController.capitalHex) {
                throw new Error("GameSetupCapital: capital already exists");
            }
            gameState.hexGridManager.fieldsController.SetCapital(axial);
            gameState.hexGridManager.fieldsController.AddSanctuary(axial);
            gameState.gameStage = GameStage.ClansSetup;
        }
        catch (err) {
            socket.emit("game-setup-capital-error", `GameSetupClans: Internal server error:\n${err}`);
            console.log(err);
        }
    })
}