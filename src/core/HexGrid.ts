import { Player } from "./Player"
import { AxialToString, shuffle } from "../services/helperFunctions"
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
    private setupClansCounter = 0
    constructor(axial: axialCoordiantes, field: Field) {
        this.q = axial.q
        this.r = axial.r
        this.field = field
    }
}
export class HexGrid {
    public grid: Map<string, Hexagon>;
    public playerFieldPresense: Map<string, Hexagon[]> = new Map()
    private avalibleTerritories: string[]
    private gameState: GameState
    public capital: Hexagon = undefined!
    private setupClansCounter = 0
    constructor(gameState: GameState) {
        this.gameState = gameState
        this.grid = new Map<string, Hexagon>();
        this.avalibleTerritories = shuffle(Array.from(territoryMap.keys()))
    }
    public ToJSON() {
        return { hex: Array.from(this.grid.values()).map(hex => ({ q: hex.q, r: hex.r, terId: hex.field.territoryId })), avalibleTer: this.avalibleTerritories };
    }
    public AddField(axial: axialCoordiantes): boolean {
        const key = AxialToString(axial);
        if (this.HasField(axial)) {
            console.log("addHex error, grid has")
            return false
        }
        if (!this.CanPlaceFieldBetween(axial)) {
            console.log("addHex error, canPlaceHexagonBetween")
            return false
        }
        if (this.avalibleTerritories.length < 0) {
            return false
        }
        const territoryId = this.avalibleTerritories.pop()!
        const hexagon = new Hexagon(axial, new Field(territoryId));
        this.avalibleTerritories.filter(t => t !== territoryId)
        this.grid.set(key, hexagon);
        return true;
    }
    public Init(): void {
        if (this.grid.size > 0) {
            return
        }
        const t1Id = this.avalibleTerritories.pop()!
        const t2Id = this.avalibleTerritories.pop()!
        const t3Id = this.avalibleTerritories.pop()!

        this.gameState.players.forEach((player, playerId) => {
            this.playerFieldPresense.set(playerId, [])
        })

        const hex1 = new Hexagon({ q: 0, r: 0 }, new Field(t1Id))
        const hex2 = new Hexagon({ q: 1, r: 0 }, new Field(t2Id))
        const hex3 = new Hexagon({ q: 0, r: 1 }, new Field(t3Id))

        this.grid.set(AxialToString({ q: hex1.q, r: hex1.r }), hex1);
        this.grid.set(AxialToString({ q: hex2.q, r: hex2.r }), hex2);
        this.grid.set(AxialToString({ q: hex3.q, r: hex3.r }), hex3);
        return
    }
    public GetAllValidPlacements(): [number, number][] {
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

        const axial: axialCoordiantes = {
            q: 0,
            r: 0
        }
        for (let q = minQ; q <= maxQ; q++) {
            for (let r = minR; r <= maxR; r++) {
                axial.q = q
                axial.r = r
                if (this.CanPlaceFieldBetween(axial)) {
                    validPlacements.push([q, r]);
                }
            }
        }
        return validPlacements;
    }
    private HasField(axial: axialCoordiantes): boolean {
        const key = AxialToString(axial);
        return this.grid.has(key);
    }
    private CanPlaceFieldBetween(axial: axialCoordiantes): boolean {
        if (!this.HasField(axial)) {
            const neighbors = this.GetNeighbors(axial);
            if (neighbors.length >= 2) {
                return true;
            }
        }
        return false;
    }
    private GetNeighbors(axial: axialCoordiantes): Hexagon[] {
        const directions = [
            { q: 1, r: 0 },
            { q: 0, r: -1 },
            { q: -1, r: 0 },
            { q: -1, r: 1 },
            { q: 0, r: 1 },
            { q: 1, r: -1 },
        ];
        const neighbors: Hexagon[] = [];
        const axialNeighbor: axialCoordiantes = {
            q: 0,
            r: 0
        }
        for (const dir of directions) {
            axialNeighbor.q = axial.q + dir.q;
            axialNeighbor.r = axial.r + dir.r;
            if (this.HasField(axialNeighbor)) {
                neighbors.push(this.grid.get(AxialToString(axialNeighbor))!);
            }
        }
        return neighbors;
    }
    AddClans(player: Player, clansNum: number, axial: axialCoordiantes): void {
        if (!player) {
            return
        }
        const hex: Hexagon | undefined = this.grid.get(AxialToString(axial))
        if (!hex) {
            return
        }
        //Maybe unnessasary check
        if (!this.playerFieldPresense.has(player.id)) {
            this.playerFieldPresense.set(player.id, [])
        }

        const field: Field = hex.field
        if (clansNum > player.clansLeft) {
            return
        }
        if (field.playersClans.has(player.id)) {
            const currentClans = field.playersClans.get(player.id)
            field.playersClans.set(player.id, currentClans! + clansNum)
        } else {
            field.playersClans.set(player.id, clansNum)
        }
        player.clansLeft -= clansNum

        const playerFieldsPresense: Hexagon[] = this.playerFieldPresense.get(player.id)!
        if (!playerFieldsPresense.includes(hex)) {
            playerFieldsPresense.push(hex)
        }
    }
    SetCapital(axial: axialCoordiantes) {
        const hex: Hexagon | undefined = this.grid.get(AxialToString(axial))
        if (!hex) {
            return
        }
        this.capital = hex
    }
    SetupClans(): boolean {
        if (this.setupClansCounter < 2 * this.gameState.numPlayers) {
            this.setupClansCounter++
            return false
        }
        return true

        // const setupCoordinates: [axialCoordiantes, axialCoordiantes, axialCoordiantes]
        //     = [{ q: 0, r: 0 }, { q: 1, r: 0 }, { q: 0, r: 1 }]
        // const playersId = Array.from(this.gameState.players.keys());
        // const playerIdToNumberMap = new Map<string, number>();
        // for (const playerId of playersId) {
        //     playerIdToNumberMap.set(playerId, 0); 
        // }
        // setupCoordinates.forEach(axial => {
        //     const hex: Hexagon = this.grid.get(AxialToString(axial))!
        // })

    }
}
