import { GameStage, AttackerAction, DeffenderAction } from "../../types/Enums"
import { IAttackerParams } from "../../types/Interfaces"
import { GameState } from "../gameState/GameState"
import { Player } from "../Player"
import { Hexagon } from "../map/HexagonField"
import { Fight } from "./Fight"

export class FightManager {
    private fights: Fight[] = []
    public currentFight: Fight | null = null
    private status: boolean = false
    private gameState: GameState
    constructor(gameState: GameState) {
        this.gameState = gameState
    }
    InitFight(playerAttacker: Player, hex: Hexagon) {
        if (hex.field.playersClans.size < 2) {
            throw new Error("FightManager.InitFight: Can't start a fight, not enough players")
        }
        const fight: Fight = new Fight(hex, playerAttacker, this.gameState)
        if (!this.currentFight) {
            this.currentFight = fight
        }
        this.fights.push(fight)
        this.status = true
        this.gameState.gameStage = GameStage.Fight
    }
    AttackerAction({ player, attackerAction, targetPlayerId, axial }: IAttackerParams): void {
        if (!this.currentFight) {
            throw new Error("FightManager.AttackerAction: no current fight")
        }
        if (this.currentFight.FightTurnOrder.activePlayerId !== player.id) {
            throw new Error("FightManager.AttackerAction: wrong active player id")
        }
        if (this.currentFight.attackCycle.status === true) {
            throw new Error("FightManager.AttackerAction: attack cycle not resolved")
        }
        if (attackerAction === AttackerAction.Atack) {
            if (!targetPlayerId) {
                throw new Error("FightManager.AttackerAction: no target playerId provided")
            }
            try {
                this.currentFight.AttackRequest(player, targetPlayerId)
            } catch (err) {
                console.error(err)
                throw err
            }
        } else if (attackerAction === AttackerAction.Move) {
            if (!axial) {
                throw new Error("FightManager.AttackerAction: no axial is provided")
            }
            if (!this.gameState.map.HasHexagon(axial)) {
                throw new Error(`FightManager: no hexagon with axial:${axial}`)
            }
            //In development
            // this.currentFight.PerformMove(player, axial)
            this.currentFight.UpdateFight()
            this.TryCurrentFightTermination()
        } else if (attackerAction === AttackerAction.Epos) {
            //In development
            this.currentFight.UpdateFight()
            this.TryCurrentFightTermination()
        }
    }
    DeffenderAction(deffenderPlayer: Player, deffenderAction: DeffenderAction, cardId?: string) {
        if (!this.currentFight) {
            throw new Error("FightManager.DeffenderAction: no current fight")
        }
        if (deffenderAction === DeffenderAction.Card && !cardId) {
            throw new Error("FightManager.DeffenderAction: no cardId for card action")
        }
        try {
            this.currentFight.PerformAttack(deffenderPlayer, deffenderAction, cardId)
        } catch (err) {
            console.error(err)
            throw err
        }
        this.currentFight.startTimerAndListenForTrixel(10000)
        this.currentFight.UpdateFight()
        this.TryCurrentFightTermination()
    }
    SkipDeffenderAction(deffenderPlayer: Player) {
        if (!this.currentFight) {
            return
        }
        if (!this.currentFight.attackCycle) {
            return
        }
        if (this.currentFight.attackCycle.defenderPlayerId !== deffenderPlayer.id) {
            return
        }
        this.currentFight.RestoreAttackCycle()
    }
    PlayerPeaceVote(player: Player) {
        if (!this.currentFight) {
            throw new Error("FightManager.PlayerPeaceVote: no current fight")
        }
        if (!this.currentFight.FightTurnOrder.playersId.includes(player.id)) {
            throw new Error("FightManager.PlayerPeaceVote: wrong player id")
        }
        this.currentFight.players[player.id].peace = true
        this.TryCurrentFightTermination()
    }
    private TryCurrentFightTermination() {
        if (!this.currentFight) {
            throw new Error("FightManager.TryCurrentFightTermination: no current fight")
        }
        const isPeace = Object.values(this.currentFight.players).every((data) => data.peace);
        if (this.currentFight.FightTurnOrder.playersId.length <= 1 || isPeace) {
            if (this.fights.length > 1) {
                this.fights = this.fights.filter((f) => f !== this.currentFight);
                this.currentFight = this.fights[0]
            } else {
                this.fights.pop();
                this.currentFight = null;
                this.gameState.gameStage = GameStage.Season;
            }
        }
    }
}