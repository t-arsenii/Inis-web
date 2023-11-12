import { TrixelCondition } from "../types/Types";
import { GameState } from "./gameState/GameState";
import { Player } from "./Player";

export class TrixelManager {
    trixelArray: Map<string, Set<string>>;
    private _gameState: GameState;
    constructor(gameState: GameState) {
        this._gameState = gameState;
        this.trixelArray = new Map();
    }
    Init(): void {
        const players = this._gameState.playerManager.GetPlayers();
        players.forEach((player) => {
            this.trixelArray.set(player.id, new Set<string>())
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