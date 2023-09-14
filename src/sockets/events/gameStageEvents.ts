import { Socket } from "socket.io";
import { axialCoordiantes } from "../../types/Types";
import { CheckSocketGameConnection, GetGameStateAndPlayer } from "../../services/helperFunctions";
import { GameStage } from "../../types/Enums";
interface IGameStage {
    gameId: string,
    userId: string,
    axial: axialCoordiantes
}
export function gameLobbyHandler(socket: Socket) {
    socket.on("game-setup-clans", ({ gameId, userId: playerId, axial }: IGameStage) => {
        if (!CheckSocketGameConnection(socket, gameId)) {
            return
        }
        const res = GetGameStateAndPlayer(socket, gameId, playerId)
        if (res === undefined) {
            return
        }
        const { gameState, player } = res

        if (gameState.gameStage !== GameStage.ClansSetup) {
            return
        }
        if (!gameState.map.capital) {
            return
        }
        if (!player.isActive) {
            return
        }
        gameState.map.AddClans(player, 1, axial)
        gameState.NextTurn()
        if (gameState.map.SetupClans()) {
            gameState.gameStage = GameStage.Gathering
        }
    })

    socket.on("game-setup-capital", ({ gameId, userId: playerId, axial }: IGameStage) => {
        if (!CheckSocketGameConnection(socket, gameId)) {
            return
        }
        const res = GetGameStateAndPlayer(socket, gameId, playerId)
        if (res === undefined) {
            return
        }
        const { gameState, player } = res
        if (gameState.gameStage !== GameStage.CapitalSetup) {
            return
        }
        if (gameState.map.capital) {
            return
        }
        if (!player.isBren || !player.isActive) {
            return
        }
        gameState.map.SetCapital(axial)
        gameState.gameStage = GameStage.ClansSetup
    })
}