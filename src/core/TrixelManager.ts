import { TrixelCondition } from "../types/Types";
import { GameState } from "./GameState";
import { Player } from "./Player";

export class TrixelManager {
    trixelArray: Map<string, Set<string>> = new Map()
    private gameState: GameState
    constructor(gameState: GameState) {
        this.gameState = gameState
    }
    Init() {
        this.gameState.players.forEach((player, pId) => {
            this.trixelArray.set(pId, new Set<string>())
        })
    }
    AddTrixel(player: Player, trixel: TrixelCondition) {
        if (!this.trixelArray.has(player.id)) {
            throw new Error("TrixelManager.AddTrixel: player no found")
        }
        this.trixelArray.get(player.id)?.add(trixel.id)
    }
    HasTrixel(player: Player, trixel: TrixelCondition) {
        const playerTrixel: Set<string> = this.trixelArray.get(player.id)!
        return playerTrixel.has(trixel.id)
    }
    ClearTrixel() {

    }
    toJSON() {
        const playerTrixels = Object.fromEntries(this.trixelArray)
        return {
            playerTrixels
        }
    }
}