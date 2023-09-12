import { Player } from "../models/Player"
import { GameState } from "./GameState"

class Field {
    TerritoryId: string = ""
    sanctuaryCount: number = 0
    citadelsCount: number = 0
    playersClans: Map<string, number> = new Map<string, number>()
    spawnClans(playerId: string, clansNum: number, gameState: GameState): void {
        const player: Player | undefined = gameState.getPlayerById(playerId)
        if (!player) {
            return
        }
        if (clansNum > player.ClansLeft) {
            return
        }
        if (this.playersClans.has(player.Id)) {
            const currentClans = this.playersClans.get(player.Id)
            this.playersClans.set(player.Id, currentClans! + clansNum)
        } else {
            this.playersClans.set(player.Id, clansNum)
        }
    }
}

class Hexagon {
    public q: number
    public r: number
    public territory: Field | undefined
    constructor(q: number, r: number) {
        this.q = q
        this.r = r
    }
}
export class HexGrid {
    private grid: Map<string, Hexagon>;
    constructor() {
        this.grid = new Map<string, Hexagon>();
    }
    public toJSON() {
        return Array.from(this.grid.values()).map(hex => ({ q: hex.q, r: hex.r }));
    }
    public addHexagon(q: number, r: number): boolean {
        const key = `${q},${r}`;
        if (this.hasHexagon(q, r)) {
            console.log("addHex error, grid has")
            return false
        }
        if (!this.canPlaceHexagonBetween(q, r)) {
            console.log("addHex error, canPlaceHexagonBetween")
            return false
        }
        const hexagon = new Hexagon(q, r);
        this.grid.set(key, hexagon);
        return true;
    }
    public InitHexagons(): void {
        if (this.grid.size > 0) {
            return
        }
        const hex1 = new Hexagon(0, 0)
        const hex2 = new Hexagon(1, 0)
        const hex3 = new Hexagon(0, 1)
        this.grid.set(`${hex1.q},${hex1.r}`, hex1);
        this.grid.set(`${hex2.q},${hex2.r}`, hex2);
        this.grid.set(`${hex3.q},${hex3.r}`, hex3);
        return
    }
    public getAllValidPlacements(): [number, number][] {
        const validPlacements: [number, number][] = [];

        // Find the minimum and maximum coordinates to determine the grid size
        let minQ = Infinity;
        let maxQ = -Infinity;
        let minR = Infinity;
        let maxR = -Infinity;

        for (const hexagon of this.grid.values()) {
            minQ = Math.min(minQ, hexagon.q);
            maxQ = Math.max(maxQ, hexagon.q);
            minR = Math.min(minR, hexagon.r);
            maxR = Math.max(maxR, hexagon.r);
        }
        minQ--;
        maxQ++;
        minR--;
        maxR++;
        for (let q = minQ; q <= maxQ; q++) {
            for (let r = minR; r <= maxR; r++) {
                if (this.canPlaceHexagonBetween(q, r)) {
                    validPlacements.push([q, r]);
                }
            }
        }
        return validPlacements;
    }
    private hasHexagon(q: number, r: number): boolean {
        const key = `${q},${r}`;
        return this.grid.has(key);
    }
    private canPlaceHexagonBetween(q: number, r: number): boolean {
        if (!this.hasHexagon(q, r)) {
            const neighbors = this.getNeighbors(q, r);
            if (neighbors.length >= 2) {
                return true;
            }
        }
        return false;
    }
    private getNeighbors(q: number, r: number): Hexagon[] {
        const directions = [
            { q: 1, r: 0 },
            { q: 0, r: -1 },
            { q: -1, r: 0 },
            { q: -1, r: 1 },
            { q: 0, r: 1 },
            { q: 1, r: -1 },
        ];
        const neighbors: Hexagon[] = [];
        for (const dir of directions) {
            const neighborQ = q + dir.q;
            const neighborR = r + dir.r;
            if (this.hasHexagon(neighborQ, neighborR)) {
                neighbors.push(this.grid.get(`${neighborQ},${neighborR}`)!);
            }
        }
        return neighbors;
    }
}
