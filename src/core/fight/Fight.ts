import { Hills_ter } from "../constans/constant_territories";
import { trixelCondition_NzLys, trixelCondition_bxaty } from "../constans/constant_trixelConditions";
import { AttackerAction, DeffenderAction, GameStage, TurnOrder } from "../../types/Enums";
import { IAttackerParams } from "../../types/Interfaces";
import { AttackerCycle, PlayerTurnOrder, axialCoordinates } from "../../types/Types";
import { GameState } from "../gameState/GameState";
import { Hexagon } from "../map/HexagonField";
import { Player } from "../Player";
import { hexToAxialCoordinates } from "../../utils/helperFunctions";
export class Fight {
    gameState: GameState
    players: Record<string, { clansNum: number, peace: boolean }> = {};
    FightTurnOrder: PlayerTurnOrder = {
        playersId: [],
        direction: undefined!,
        activePlayerId: ""
    }
    attackCycle: AttackerCycle = {
        status: false,
        attackerPlayerId: null,
        defenderPlayerId: null
    }
    fightHex: Hexagon;
    constructor(hex: Hexagon, playerAttacker: Player, gameState: GameState) {
        this.fightHex = hex
        this.gameState = gameState
        hex.field.playersClans.forEach((clansNum, pId) => {
            this.players[pId] = { clansNum, peace: false };
        });
        hex.field.playersClans
        let playerFighterIds: string[] = gameState.turnOrderManager.turnOrder.playersId.filter((pId) => {
            return pId in this.players;
        });
        this.FightTurnOrder.playersId = playerFighterIds;
        this.FightTurnOrder.direction = gameState.turnOrderManager.turnOrder.direction;
        this.FightTurnOrder.activePlayerId = playerAttacker.id;
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
            const defPlayer = this.gameState.playerManager.GetPlayerById(targetPlayerId)!
            this.gameState.trixelManager.AddTrixel(defPlayer, trixelCondition_NzLys)
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
            this.gameState.map.clansController.RemoveClans(deffenderPlayer, 1, { q: this.fightHex.q, r: this.fightHex.r });

            const playerAttacker: Player = this.gameState.playerManager.GetPlayerById(this.attackCycle.attackerPlayerId)!;
            this.gameState.trixelManager.AddTrixel(playerAttacker, trixelCondition_bxaty);

        } else if (defenderAction === DeffenderAction.Card) {
            if (!cardId) {
                throw new Error("Figth.PerformAttack: no card id provided")
            }
            this.gameState.deckManager.DiscardCard(deffenderPlayer, cardId)
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
            throw new Error("Figth.PerformMove: insufficient number of clans")
        }
        try {
            this.gameState.map.clansController.MoveClans(player, hexToAxialCoordinates(this.fightHex), axialTo, clansNum);
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
        this.gameState.trixelManager.ClearTrixel()
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
    public startTimerAndListenForTrixel(timeoutMs: number) {
        const timer = setTimeout(() => {
            console.log("Action is not occurred")
            this.NextFightTurn();
        }, timeoutMs);

        this.gameState.eventEmitter.on('TrixelEvent', () => {
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
}

