import { Socket } from "socket.io";
import { axialCoordiantes } from "../../types/Types";
import { CheckSocketGameConnection, GetGameStateAndPlayer } from "../../services/helperFunctions";
import { GameStage } from "../../types/Enums";
import { GameState } from "../../core/GameState";
import { Player } from "../../core/Player";
export function gameSetupHandler(socket: Socket) {
    socket.on("game-setup-clans", (axial: axialCoordiantes) => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        try {
            if (!player.isActive) {
                throw new Error("GameSetupClans: player not active");
            }
            if (gameState.gameStage !== GameStage.ClansSetup) {
                throw new Error("GameSetupClans: game stage is not valid");
            }
            gameState.map.clansController.AddClans(player, 1, axial);
            if (gameState.map.setupController.SetupClans()) {
                gameState.gameStage = GameStage.Gathering;
                gameState.NextTurn();
                gameState.StartGatheringStage();
                return
            }
            gameState.NextTurn()
        }
        catch (err) {
            socket.emit("game-setup-clans-error", `GameSetupClans: Internal server error:\n${err}`)
            console.log(err)
        }
    })
    socket.on("game-setup-capital", (axial: axialCoordiantes) => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        try {
            if (!player.isBren || !player.isActive) {
                throw new Error("GameSetupCapital: player not active or not bren")
            }
            if (gameState.gameStage !== GameStage.CapitalSetup) {
                throw new Error("GameSetupCapital: game stage is not valid")
            }
            if (gameState.map.fieldsController.capitalHex) {
                throw new Error("GameSetupCapital: capital already exists")
            }
            gameState.map.fieldsController.SetCapital(axial);
            gameState.map.fieldsController.AddSanctuary(axial);
            gameState.gameStage = GameStage.ClansSetup
        }
        catch (err) {
            socket.emit("game-setup-capital-error", `GameSetupClans: Internal server error:\n${err}`)
            console.log(err)
        }
    })
}