import { Server, Socket } from "socket.io";
import { Player } from "../../core/Player";
import { ActionType, AttackerAction, GameStage } from "../../types/Enums";
import { IAttackerInputParams, IAttackerParams, IDeffenderInputParams } from "../../types/Interfaces";
import { GameState } from "../../core/gameState/GameState";
export function playerFightHandler(io: Server, socket: Socket) {
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
            gameState.fightManager.AttackerAction(FightParams);
            if (FightParams.attackerAction === AttackerAction.Atack) {
                io.to(gameState.id).emit("attackCycle-update", gameState.uiUpdater.getAttackCycleUiInfo());
            }
            else if (FightParams.attackerAction === AttackerAction.Move) {
                io.to(gameState.id).emit("fight-update", gameState.uiUpdater.getFightUiInfo());
                io.to(gameState.id).emit("map-update", gameState.uiUpdater.getMapUiInfo());
            } else {
                throw new Error("Not implemented");
            }

            if (gameState.fightManager.currentFight === null) {
                io.to(gameState.id).emit("sidebar-update", gameState.uiUpdater.getSidebarUiInfo());
                io.to(gameState.id).emit("game-update", gameState.uiUpdater.getGameUiInfo());
            }
        } catch (err) {
            console.log("PlayerFightAction: Error")
        }
    })
    socket.on("player-fight-deffender", (params: IDeffenderInputParams) => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        try {
            gameState.fightManager.DeffenderAction(player, params.deffenderAction, params.cardId);
            io.to(gameState.id).emit("fight-update", gameState.uiUpdater.getFightUiInfo());
            io.to(gameState.id).emit("attackCycle-update", gameState.uiUpdater.getAttackCycleUiInfo());
            if (gameState.fightManager.currentFight === null) {
                io.to(gameState.id).emit("sidebar-update", gameState.uiUpdater.getSidebarUiInfo());
                io.to(gameState.id).emit("game-update", gameState.uiUpdater.getGameUiInfo());
            }
        } catch (err) {
            console.log(err)
        }
    })
    socket.on("player-fight-peace-vote", () => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        try {
            gameState.fightManager.PlayerPeaceVote(player);
            io.to(gameState.id).emit("fight-update", gameState.uiUpdater.getFightUiInfo());
        } catch (err) {
            console.log(`PlayerFightPeaceVote:\n${err}`)
        }
    })
}