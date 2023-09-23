import { AttackerAction, DeffenderAction, GameStage, TurnOrder } from "../types/Enums";
import { IAttackerParams } from "../types/Interfaces";
import { AttackerCycle, PlayerTurnOrder } from "../types/Types";
import { Deck, DeckManager } from "./DeckManager";
import { GameState } from "./GameState";
import { Hexagon } from "./HexGrid";
import { Player } from "./Player";

export class FightManager {
    private fights: Fight[] = []
    public currentFight: Fight | undefined
    private status: boolean = false
    private gameState: GameState
    constructor(gameState: GameState) {
        this.gameState = gameState
    }
    InitFight(playerAttacker: Player, hex: Hexagon) {
        const fight: Fight = new Fight(hex, playerAttacker, this.gameState.turnOrder)
        if (!this.currentFight) {
            this.currentFight = fight
        }
        this.fights.push(fight)
        this.status = true
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
            this.currentFight.PerformAttack(deffenderPlayer, deffenderAction, this.gameState, cardId)
        } catch (err) {
            console.error(err)
            throw err
        }
        this.currentFight.UpdateFight()
        this.TryCurrentFightTermination()
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
                this.currentFight = undefined;
                this.gameState.gameStage = GameStage.Season;
            }
        }
    }
}
class Fight {
    players: Record<string, { clansNum: number, peace: boolean }> = {};
    FightTurnOrder: PlayerTurnOrder = {
        playersId: [],
        direction: undefined!,
        activePlayerId: ""
    }
    attackCycle: AttackerCycle = {
        status: false,
        attackerPlayerId: undefined,
        defenderPlayerId: undefined
    }
    fightHex: Hexagon;
    constructor(hex: Hexagon, playerAttacker: Player, turnOrder: PlayerTurnOrder) {
        this.fightHex = hex
        Object.entries(hex.field.playersClans).forEach(([pId, clansNum]) => {
            this.players[pId] = { clansNum, peace: false };
        });
        hex.field.playersClans
        let playerFighterIds: string[] = turnOrder.playersId.filter((pId) => {
            return pId in this.players;
        });
        this.FightTurnOrder.playersId = playerFighterIds
        this.FightTurnOrder.direction = turnOrder.direction
        this.FightTurnOrder.activePlayerId = playerAttacker.id
    }
    AttackRequest(player: Player, targetPlayerId: string) {
        if (this.FightTurnOrder.activePlayerId !== player.id) {
            throw new Error("Fight.AttackRequest: wrong active player id")
        }
        if (!this.FightTurnOrder.playersId.includes(targetPlayerId)) {
            throw new Error("Fight.AttackRequest: wrong player id")
        }
        this.attackCycle.status = true
        this.attackCycle.attackerPlayerId = player.id
        this.attackCycle.defenderPlayerId = targetPlayerId
    }
    PerformAttack(deffenderPlayer: Player, defenderAction: DeffenderAction, gameState: GameState, cardId?: string) {
        if (!this.attackCycle.attackerPlayerId || !this.attackCycle.defenderPlayerId || !this.attackCycle.status) {
            throw new Error("Figth.PerformAttack: attacker cycle error")
        }
        if (defenderAction === DeffenderAction.Clan) {
            this.players[this.attackCycle.defenderPlayerId].clansNum -= 1
            gameState.map.clansController.RemoveClans(deffenderPlayer, 1, { q: this.fightHex.q, r: this.fightHex.r })
        } else if (defenderAction === DeffenderAction.Card) {
            if (!cardId) {
                throw new Error("Figth.PerformAttack: no card id provided")
            }
            gameState.deckManager.playCard(deffenderPlayer, cardId)
        }
        this.attackCycle.status = false
        this.attackCycle.attackerPlayerId = undefined
        this.attackCycle.defenderPlayerId = undefined

    }
    PerformMove(player: Player, hex: Hexagon) {
        //In development
    }
    PerformEpos() {
        //In development
    }
    UpdateFight() {
        Object.entries(this.players).forEach(([pId, pData]) => {
            if (pData.clansNum <= 0) {
                this.FightTurnOrder.playersId = this.FightTurnOrder.playersId.filter(id => pId !== id)
            }
        });
        this.NextFightTurn()
    }
    private NextFightTurn(): void {
        const activePlayerId = this.FightTurnOrder.activePlayerId
        const activePlayerIndex = this.FightTurnOrder.playersId.indexOf(activePlayerId)
        let nextIndex: number = 0
        const numPlayers = this.FightTurnOrder.playersId.length
        if (this.FightTurnOrder.direction === TurnOrder.clockwise) {
            nextIndex = (activePlayerIndex + 1) % numPlayers;
        }
        else {
            nextIndex = (activePlayerIndex - 1 + numPlayers) % numPlayers;
        }
        const newActivePlayerId = this.FightTurnOrder.playersId[nextIndex]
        this.FightTurnOrder.activePlayerId = newActivePlayerId
    }
}