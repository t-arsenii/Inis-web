import { Player } from "../Player"
import { AxialToString, shuffle } from "../../services/helperFunctions"
import { GameState } from "../GameState"
import { territoryMap } from "../../constans/constans_territories"
import { axialCoordiantes } from "../../types/Types"

export class Field {
    territoryId: string = ""
    sanctuaryCount: number = 0
    citadelsCount: number = 0
    playersClans: Record<string, number> = {}
    constructor(terId: string) {
        this.territoryId = terId
    }
}

export class Hexagon {
    public q: number
    public r: number
    public field: Field
    constructor(axial: axialCoordiantes, field: Field) {
        this.q = axial.q
        this.r = axial.r
        this.field = field
    }
}
class ClansController {
    private playerFieldPresense: Map<string, Hexagon[]>
    private hexGrid: HexGrid
    constructor(hexGrid: HexGrid, playerFieldPresense: Map<string, Hexagon[]>) {
        this.hexGrid = hexGrid
        this.playerFieldPresense = playerFieldPresense
    }
    public AddClans(player: Player, clansNum: number, axial: axialCoordiantes): boolean {
        if (!this.hexGrid.HasHexagon(axial)) {
            return false
        }
        //Maybe unnessasary check
        if (!this.playerFieldPresense.has(player.id)) {
            this.playerFieldPresense.set(player.id, [])
        }

        const hex: Hexagon = this.hexGrid.GetHex(axial)!
        const field: Field = hex.field
        if (clansNum > player.clansLeft) {
            return false
        }
        if (field.playersClans.hasOwnProperty(player.id)) {
            const currentClans = field.playersClans[player.id]
            field.playersClans[player.id] = currentClans! + clansNum
        } else {
            field.playersClans[player.id] = clansNum
        }
        player.clansLeft -= clansNum
        const playerFieldsPresense: Hexagon[] = this.playerFieldPresense.get(player.id)!
        if (!playerFieldsPresense.includes(hex)) {
            playerFieldsPresense.push(hex)
        }
        return true
    }
}
class SetupController {
    private gameState: GameState
    constructor(gameState: GameState) {
        this.gameState = gameState
    }
    private setupClansCounter = 0
    public SetupClans(): boolean {
        this.setupClansCounter++
        if (this.setupClansCounter === this.gameState.numPlayers * 2) {
            return true
        }
        return false
    }
    public SkipSetupClans(): void {
        this.setupClansCounter = this.gameState.numPlayers * 2
    }
}
class FieldsController {
    private hexGrid: HexGrid
    public playerFieldPresense: Map<string, Hexagon[]> = new Map()
    public avalibleTerritories: string[] = shuffle(Array.from(territoryMap.keys()))
    public capital: Hexagon | undefined = undefined
    sanctuariesLeft: number = 0
    citadelsLeft: number = 0
    constructor(hexGrid: HexGrid) {
        this.hexGrid = hexGrid
    }
    public AddRandomField(axial: axialCoordiantes): boolean {
        const key = AxialToString(axial);
        if (this.hexGrid.HasHexagon(axial)) {
            console.log("addHex error, grid has")
            return false
        }
        if (!this.hexGrid.CanPlaceFieldBetween(axial)) {
            console.log("addHex error, canPlaceHexagonBetween")
            return false
        }
        if (this.avalibleTerritories.length < 0) {
            return false
        }
        const territoryId = this.avalibleTerritories.pop()!
        const hexagon = new Hexagon(axial, new Field(territoryId));
        this.avalibleTerritories.filter(t => t !== territoryId)
        this.hexGrid.grid.set(key, hexagon);
        return true;
    }
    public SetCapital(axial: axialCoordiantes): boolean {
        if (!this.hexGrid.HasHexagon(axial)) {
            return false
        }
        const hex: Hexagon = this.hexGrid.grid.get(AxialToString(axial))!
        this.capital = hex
        hex.field.citadelsCount++
        return true
    }
    public GetPlayerHex(player: Player): Hexagon[] | undefined {
        if (!this.playerFieldPresense.has(player.id)) {
            return undefined
        }
        return this.playerFieldPresense.get(player.id)
    }
    public CountPlayerCitadels(player: Player): number {
        let citadelNum: number = 0
        const playerHex: Hexagon[] = this.playerFieldPresense.get(player.id)!
        playerHex.forEach(hex => {
            if (hex.field.citadelsCount > 0) {
                citadelNum += hex.field.citadelsCount
            }
        })
        return citadelNum
    }
}
export class HexGrid {
    public grid: Map<string, Hexagon> = new Map<string, Hexagon>();
    public fieldsController: FieldsController = new FieldsController(this)
    public clansController: ClansController = new ClansController(this, this.fieldsController.playerFieldPresense)
    public setupController: SetupController
    // public playerFieldPresense: Map<string, Hexagon[]> = new Map()
    // public avalibleTerritories: string[] = shuffle(Array.from(territoryMap.keys()))
    public gameState: GameState
    // public capital: Hexagon | undefined = undefined
    // private setupClansCounter = 0
    constructor(gameState: GameState) {
        this.gameState = gameState
        this.setupController = new SetupController(gameState)

    }
    // public AddRandomField(axial: axialCoordiantes): boolean {
    //     const key = AxialToString(axial);
    //     if (this.HasHexagon(axial)) {
    //         console.log("addHex error, grid has")
    //         return false
    //     }
    //     if (!this.CanPlaceFieldBetween(axial)) {
    //         console.log("addHex error, canPlaceHexagonBetween")
    //         return false
    //     }
    //     if (this.avalibleTerritories.length < 0) {
    //         return false
    //     }
    //     const territoryId = this.avalibleTerritories.pop()!
    //     const hexagon = new Hexagon(axial, new Field(territoryId));
    //     this.avalibleTerritories.filter(t => t !== territoryId)
    //     this.grid.set(key, hexagon);
    //     return true;
    // }
    // public Init(): void {
    //     if (this.grid.size > 0) {
    //         return
    //     }
    //     const t1Id = this.avalibleTerritories.pop()!
    //     const t2Id = this.avalibleTerritories.pop()!
    //     const t3Id = this.avalibleTerritories.pop()!

    //     this.gameState.players.forEach((player, playerId) => {
    //         this.playerFieldPresense.set(playerId, [])
    //     })

    //     const hex1 = new Hexagon({ q: 0, r: 0 }, new Field(t1Id))
    //     const hex2 = new Hexagon({ q: 1, r: 0 }, new Field(t2Id))
    //     const hex3 = new Hexagon({ q: 0, r: 1 }, new Field(t3Id))

    //     this.grid.set(AxialToString({ q: hex1.q, r: hex1.r }), hex1);
    //     this.grid.set(AxialToString({ q: hex2.q, r: hex2.r }), hex2);
    //     this.grid.set(AxialToString({ q: hex3.q, r: hex3.r }), hex3);
    //     return
    // }
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
    public HasHexagon(axial: axialCoordiantes): boolean {
        const key = AxialToString(axial);
        return this.grid.has(key);
    }
    public CanPlaceFieldBetween(axial: axialCoordiantes): boolean {
        if (!this.HasHexagon(axial)) {
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
            if (this.HasHexagon(axialNeighbor)) {
                neighbors.push(this.grid.get(AxialToString(axialNeighbor))!);
            }
        }
        return neighbors;
    }
    // public AddClans(player: Player, clansNum: number, axial: axialCoordiantes): boolean {
    //     const hex: Hexagon | undefined = this.grid.get(AxialToString(axial))
    //     if (!hex) {
    //         return false
    //     }
    //     //Maybe unnessasary check
    //     if (!this.playerFieldPresense.has(player.id)) {
    //         this.playerFieldPresense.set(player.id, [])
    //     }

    //     const field: Field = hex.field
    //     if (clansNum > player.clansLeft) {
    //         return false
    //     }
    //     if (field.playersClans.hasOwnProperty(player.id)) {
    //         const currentClans = field.playersClans[player.id]
    //         field.playersClans[player.id] = currentClans! + clansNum
    //     } else {
    //         field.playersClans[player.id] = clansNum
    //     }
    //     player.clansLeft -= clansNum
    //     const playerFieldsPresense: Hexagon[] = this.playerFieldPresense.get(player.id)!
    //     if (!playerFieldsPresense.includes(hex)) {
    //         playerFieldsPresense.push(hex)
    //     }
    //     return true
    // }
    // public SetCapital(axial: axialCoordiantes): boolean {
    //     const hex: Hexagon | undefined = this.grid.get(AxialToString(axial))
    //     if (!hex) {
    //         return false
    //     }
    //     this.capital = hex
    //     return true
    // }
    // public SetupClans(): boolean {
    //     this.setupClansCounter++
    //     if (this.setupClansCounter === this.gameState.numPlayers * 2) {
    //         return true
    //     }
    //     return false
    // }
    // public SkipSetupClans(): void {
    //     this.setupClansCounter = this.gameState.numPlayers * 2
    // }
    // public GetPlayerHex(player: Player): Hexagon[] | undefined {
    //     if (!this.playerFieldPresense.has(player.id)) {
    //         return undefined
    //     }
    //     return this.playerFieldPresense.get(player.id)
    // }
    public GetHex(axial: axialCoordiantes): Hexagon | undefined {
        return this.grid.get(AxialToString(axial))
    }
}
