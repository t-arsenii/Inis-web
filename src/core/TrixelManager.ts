import { TrixelCondition } from "../types/Types";
import { GameState } from "./gameState/GameState";
import { Player } from "./Player";

export class TrixelManager {
    trixelArray: Map<string, Set<string>> = new Map()
    private gameState: GameState
    constructor(gameState: GameState) {
        this.gameState = gameState
    }
    Init(): void {
        this.gameState.players.forEach((player, pId) => {
            this.trixelArray.set(pId, new Set<string>())
        })
    }
    AddTrixel(player: Player, trixel: TrixelCondition): void {
        if (!this.trixelArray.has(player.id)) {
            throw new Error("TrixelManager.AddTrixel: player no found")
        }
        this.trixelArray.get(player.id)?.add(trixel.id)
    }
    HasTrixel(player: Player, trixel: TrixelCondition): boolean {
        const playerTrixel: Set<string> = this.trixelArray.get(player.id)!
        return playerTrixel.has(trixel.id)
    }
    ClearTrixel(): void {
        this.trixelArray.forEach((trixelSet) => {
            trixelSet.clear()
        })
    }
    toJSON() {
        const playerTrixels = Object.fromEntries(this.trixelArray)
        return {
            playerTrixels
        }
    }
}