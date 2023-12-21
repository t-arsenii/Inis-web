import { Hills_ter } from "../constans/constant_territories";
import { trixelCondition_NzLys, trixelCondition_bxaty } from "../constans/constant_trixelConditions";
import { AttackerAction, DeffenderAction, FightStage, GameStage, TurnOrder } from "../../types/Enums";
import { IAttackerParams } from "../../types/Interfaces";
import { AttackerCycleType, PlayerTurnOrderType, axialCoordinates } from "../../types/Types";
import { GameState } from "../gameState/GameState";
import { Hexagon } from "../map/Field";
import { Player } from "../Player";
import { hexToAxialCoordinates } from "../../utils/helperFunctions";
export class Fight {
    _gameState: GameState;
    players: Record<string, { clansNum: number, peace: boolean }>;
    FightTurnOrder: PlayerTurnOrderType;
    attackCycle: AttackerCycleType;
    fightHex: Hexagon;
    fightStage: FightStage;
    constructor(hex: Hexagon, playerAttacker: Player, gameState: GameState) {
        this.fightHex = hex
        this._gameState = gameState

        this.players = {}
        hex.field.playersClans.forEach((clansNum, pId) => {
            this.players[pId] = { clansNum, peace: false };
        });
        hex.field.playersClans
        let playerFighterIds: string[] = gameState.turnOrderManager.turnOrder.playersId.filter((pId) => {
            return pId in this.players;
        });

        this.FightTurnOrder = {
            playersId: [],
            direction: undefined!,
            activePlayerId: ""
        }
        this.FightTurnOrder.playersId = playerFighterIds;
        this.FightTurnOrder.direction = gameState.turnOrderManager.turnOrder.direction;
        this.FightTurnOrder.activePlayerId = playerAttacker.id;

        this.attackCycle = {
            status: false,
            attackerPlayerId: null,
            defenderPlayerId: null
        }
        this.fightStage = FightStage.setup;
    }
    AttackRequest(player: Player, targetPlayerId: string) {
        if (this.FightTurnOrder.activePlayerId !== player.id) {
            throw new Error("Fight.AttackRequest: wrong active player id")
        }
        if (!this.FightTurnOrder.playersId.includes(targetPlayerId)) {
            throw new Error("Fight.AttackRequest: wrong player id")
        }
        //Trixel for hills
        if (this.fightHex.field.territoryId === Hills_ter.id) {
            const defPlayer = this._gameState.playerManager.GetPlayerById(targetPlayerId)!
            this._gameState.trixelManager.AddTrixel(defPlayer, trixelCondition_NzLys)
        }
        this.attackCycle.status = true
        this.attackCycle.attackerPlayerId = player.id
        this.attackCycle.defenderPlayerId = targetPlayerId
    }
    PerformAttack(deffenderPlayer: Player, defenderAction: DeffenderAction, cardId?: string) {
        if (!this.attackCycle.attackerPlayerId || !this.attackCycle.defenderPlayerId || !this.attackCycle.status) {
            throw new Error("Figth.PerformAttack: attacker cycle error")
        }
        if (defenderAction === DeffenderAction.Clan) {
            this.players[this.attackCycle.defenderPlayerId].clansNum -= 1;
            this._gameState.hexGridManager.clansController.RemoveClans(deffenderPlayer, 1, { q: this.fightHex.q, r: this.fightHex.r });

            const playerAttacker: Player = this._gameState.playerManager.GetPlayerById(this.attackCycle.attackerPlayerId)!;
            this._gameState.trixelManager.AddTrixel(playerAttacker, trixelCondition_bxaty);

        } else if (defenderAction === DeffenderAction.Card) {
            if (!cardId) {
                throw new Error("Figth.PerformAttack: no card id provided")
            }
            this._gameState.deckManager.DiscardCard(deffenderPlayer, cardId)
        }
        this.RestoreAttackCycle()
    }
    RestoreAttackCycle() {
        this.attackCycle.status = false
        this.attackCycle.attackerPlayerId = null
        this.attackCycle.defenderPlayerId = null
    }
    PerformMove(player: Player, axialTo: axialCoordinates, clansNum: number) {
        const clansFighLeft = this.players[player.id].clansNum;
        if (clansNum < 0 || clansNum > clansFighLeft) {
            throw new Error("Figth.PerformMove: insufficient number of clans");
        }
        if (!this._gameState.hexGridManager.fieldsController.IsLeader(player, axialTo)) {
            throw new Error("Figth.PerformMove: player is not a leader on axialTo");
        }
        try {
            this._gameState.hexGridManager.clansController.MoveClans(player, hexToAxialCoordinates(this.fightHex), axialTo, clansNum);
            this.players[player.id].clansNum = clansFighLeft - clansNum;
        } catch (err) {
            throw err;
        }
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
    }
    private NextFightTurn(): void {
        this._gameState.trixelManager.ClearTrixel();
        const newActivePlayerId = this.FightTurnOrder.playersId[this.GetNextPlayerIndex()];
        this.FightTurnOrder.activePlayerId = newActivePlayerId;
    }
    public startTimerAndListenForTrixel(timeoutMs: number) {
        const timer = setTimeout(() => {
            console.log("Action is not occurred")
            this.NextFightTurn();
        }, timeoutMs);

        this._gameState.eventEmitter.on('TrixelEvent', () => {
            clearTimeout(timer);
            console.log("Action occurred.");
            this.NextFightTurn();
        });
    }
    toJSON() {
        const { players, FightTurnOrder, attackCycle, fightHex } = this
        return {
            players,
            FightTurnOrder,
            attackCycle,
            fightHex
        }
    }
    private GetNextPlayerIndex() {
        let nextIndex: number = 0;
        const activePlayerIndex = this.FightTurnOrder.playersId.indexOf(this.FightTurnOrder.activePlayerId);
        const numPlayers = this.FightTurnOrder.playersId.length;
        if (this.FightTurnOrder.direction === TurnOrder.clockwise) {
            nextIndex = (activePlayerIndex + 1) % numPlayers;
        }
        else {
            nextIndex = (activePlayerIndex - 1 + numPlayers) % numPlayers;
        }
        return nextIndex;
    }
}

