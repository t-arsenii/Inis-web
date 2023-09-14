import { Player } from "./Player"
import { shuffle } from "../services/helperFunctions"
import { GameState } from "./GameState"
import { territoryMap } from "../constans/constans_territories"
import { axialCoordiantes } from "../types/Types"

export class Field {
    territoryId: string = ""
    sanctuaryCount: number = 0
    citadelsCount: number = 0
    playersClans: Map<string, number> = new Map<string, number>()
    constructor(terId: string) {
        this.territoryId = terId
    }
}

export class Hexagon {
    public q: number
    public r: number
    public field: Field
    constructor(q: number, r: number, field: Field) {
        this.q = q
        this.r = r
        this.field = field
    }
}
export class HexGrid {
    public grid: Map<string, Hexagon>;
    private avalibleTerritories: string[]
    private gameState: GameState
    constructor(gameState: GameState) {
        this.gameState = gameState
        this.grid = new Map<string, Hexagon>();
        this.avalibleTerritories = shuffle(Array.from(territoryMap.keys()))
    }
    public toJSON() {
        return { hex: Array.from(this.grid.values()).map(hex => ({ q: hex.q, r: hex.r, terId: hex.field.territoryId })), avalibleTer: this.avalibleTerritories };
    }
    public addField(q: number, r: number): boolean {
        const key = `${q},${r}`;
        if (this.hasField(q, r)) {
            console.log("addHex error, grid has")
            return false
        }
        if (!this.canPlaceFieldBetween(q, r)) {
            console.log("addHex error, canPlaceHexagonBetween")
            return false
        }
        if (this.avalibleTerritories.length < 0) {
            return false
        }
        const territoryId = this.avalibleTerritories.pop()!
        const hexagon = new Hexagon(q, r, new Field(territoryId));
        this.avalibleTerritories.filter(t => t !== territoryId)
        this.grid.set(key, hexagon);
        return true;
    }
    public InitFields(): void {
        if (this.grid.size > 0) {
            return
        }
        const t1Id = this.avalibleTerritories.pop()!
        const t2Id = this.avalibleTerritories.pop()!
        const t3Id = this.avalibleTerritories.pop()!

        const hex1 = new Hexagon(0, 0, new Field(t1Id))
        const hex2 = new Hexagon(1, 0, new Field(t2Id))
        const hex3 = new Hexagon(0, 1, new Field(t3Id))

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
                if (this.canPlaceFieldBetween(q, r)) {
                    validPlacements.push([q, r]);
                }
            }
        }
        return validPlacements;
    }
    private hasField(q: number, r: number): boolean {
        const key = `${q},${r}`;
        return this.grid.has(key);
    }
    private canPlaceFieldBetween(q: number, r: number): boolean {
        if (!this.hasField(q, r)) {
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
            if (this.hasField(neighborQ, neighborR)) {
                neighbors.push(this.grid.get(`${neighborQ},${neighborR}`)!);
            }
        }
        return neighbors;
    }
    spawnClans(playerId: string, clansNum: number, axial: axialCoordiantes): void {
        const player: Player | undefined = this.gameState.GetPlayerById(playerId)
        if (!player) {
            return
        }
        const hex: Hexagon | undefined = this.grid.get(`${axial.q},${axial.r}`)
        if (!hex) {
            return
        }
        const field: Field = this.grid.get(`${axial.q},${axial.r}`)?.field!
        if (clansNum > player.ClansLeft) {
            return
        }
        if (field.playersClans.has(player.Id)) {
            const currentClans = field.playersClans.get(player.Id)
            field.playersClans.set(player.Id, currentClans! + clansNum)
        } else {
            field.playersClans.set(player.Id, clansNum)
        }
        player.ClansLeft -= clansNum
    }
}
