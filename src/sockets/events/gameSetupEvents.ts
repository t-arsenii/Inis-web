import { Socket } from "socket.io";
import { axialCoordiantes } from "../../types/Types";
import { CheckSocketGameConnection, GetGameStateAndPlayer } from "../../services/helperFunctions";
import { GameStage } from "../../types/Enums";
import { GameState } from "../../core/GameState";
import { Player } from "../../core/Player";
// interface IGameStage {
//     gameId: string,
//     userId: string,
//     axial: axialCoordiantes
// }
export function gameSetupHandler(socket: Socket) {
    socket.on("game-setup-clans", (axial: axialCoordiantes) => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        if (!player.isActive) {
            socket.emit("game-setup-info", "GameSetupClans: player not active")
            return
        }
        if (gameState.gameStage !== GameStage.ClansSetup) {
            socket.emit("game-setup-info", "GameSetupClans: game stage is not valid")
            return
        }
        if (!gameState.map.AddClans(player, 1, axial)) {
            socket.emit("game-setup-info", "GameSetupClans: error adding clans")
            return
        }
        if (gameState.map.SetupClans()) {
            gameState.gameStage = GameStage.Gathering
            gameState.NextTurn()
            return
        }
        gameState.NextTurn()
    })

    socket.on("game-setup-capital", (axial: axialCoordiantes) => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!

        if (!player.isBren || !player.isActive) {
            socket.emit("game-setup-info", "GameSetupCapital: player not active or not bren")
            return
        }
        if (gameState.gameStage !== GameStage.CapitalSetup) {
            socket.emit("game-setup-info", "GameSetupCapital: game stage is not valid")
            return
        }
        if (gameState.map.capital) {
            socket.emit("game-setup-info", "GameSetupCapital: capital already exists")
            return
        }
        const setCapitalRes = gameState.map.SetCapital(axial)
        if (!setCapitalRes) {
            socket.emit("game-setup-info", `GameSetupCapital: capital placement error(q:${axial.q},r:${axial.r})`)
            return
        }
        gameState.gameStage = GameStage.ClansSetup
    })
}