import { Server, Socket } from "socket.io";
import { Player } from "../../core/Player";
import { ActionType, AttackerAction, GameStage } from "../../types/Enums";
import { IAttackerInputParams, IAttackerParams, IDeffenderInputParams } from "../../types/Interfaces";
import { GameState } from "../../core/gameState/GameState";
import { io } from "../../initServer"
export function playerFightHandler(socket: Socket) {
    socket.on("player-fight-attacker", (playerAction: IAttackerInputParams) => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        const FightParams: IAttackerParams = {
            player,
            attackerAction: playerAction.attackerAction,
            axial: playerAction.axial,
            targetPlayerId: playerAction.targetPlayerId,
            clansNum: playerAction.clansNum
        }
        try {
            gameState.fightManager.AttackerAction(FightParams);
            if (FightParams.attackerAction === AttackerAction.Atack) {
                gameState.uiUpdater.EmitAttackCycleUpdate();
            }
            else if (FightParams.attackerAction === AttackerAction.Move) {
                gameState.uiUpdater.EmitFightUpdate()
                gameState.uiUpdater.EmitMapUpdate();
            } else {
                throw new Error("Not implemented");
            }

            if (gameState.fightManager.currentFight === null) {
                gameState.uiUpdater.EmitSidebarUpdate();
                gameState.uiUpdater.EmitGameUpdate();
            }
        } catch (err) {
            console.log("PlayerFightAction: Error\n" + err)
        }
    })
    socket.on("player-fight-deffender", (params: IDeffenderInputParams) => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        try {
            gameState.fightManager.DeffenderAction(player, params.deffenderAction, params.cardId);
            gameState.uiUpdater.EmitMapUpdate();
            if (gameState.fightManager.currentFight === null) {
                gameState.uiUpdater.EmitSidebarUpdate();
                gameState.uiUpdater.EmitGameUpdate();
                return;
            }
            gameState.uiUpdater.EmitFightUpdate();
            gameState.uiUpdater.EmitAttackCycleUpdate();
            gameState.uiUpdater.EmitMyDeckUpdate(player);
        } catch (err) {
            console.log(err)
        }
    })
    socket.on("player-protectClan", () => {
        throw new Error("Not implemented exception");
    })
    socket.on("player-fight-peace-vote", () => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        try {
            gameState.fightManager.PlayerPeaceVote(player);
            gameState.uiUpdater.EmitFightUpdate();
        } catch (err) {
            console.log(`PlayerFightPeaceVote:\n${err}`)
        }
    })
    socket.on("player-move-info", () => {
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        try {
            if (gameState.gameStage !== GameStage.Fight) {
                throw new Error("player-move-info: Game Stage is not fight");
            }
            gameState.uiUpdater.EmitPlayerFightMoveUpdate(player);
        } catch (err) {
            console.error(err);
        }
    });
}