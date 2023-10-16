import { Socket } from "socket.io";
import { Player } from "../../core/Player";
import { GameState } from "../../gameState/GameState";
import { ActionType, AttackerAction, GameStage } from "../../types/Enums";
import { IAttackerInputParams, IAttackerParams, IDeffenderInputParams } from "../../types/Interfaces";
export function playerFightHandler(socket: Socket) {
    socket.on("player-fight-attacker", (playerAction: IAttackerInputParams) => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        const FightParams: IAttackerParams = {
            player,
            attackerAction: playerAction.attackerAction,
            axial: playerAction.axial,
            targetPlayerId: playerAction.targetPlayerId
        }
        try {
            gameState.fightManager.AttackerAction(FightParams)
        } catch (err) {
            console.log("PlayerFightAction: Error")
        }
    })
    socket.on("player-fight-deffender", (params: IDeffenderInputParams) => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        try {
            gameState.fightManager.DeffenderAction(player, params.deffenderAction, params.cardId)
        } catch (err) {
            console.log(err)
        }
    })
    socket.on("player-fight-peace-vote", () => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        try {
            gameState.fightManager.PlayerPeaceVote(player)
        } catch (err) {
            console.log(`PlayerFightPeaceVote:\n${err}`)
        }
    })
}