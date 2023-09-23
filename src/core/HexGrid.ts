import { Player } from "./Player"
import { AxialToString, shuffle } from "../services/helperFunctions"
import { GameState } from "./GameState"
import { territoryMap } from "../constans/constans_territories"
import { axialCoordiantes } from "../types/Types"
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
    public AddClans(player: Player, clansNum: number, axial: axialCoordiantes): void {
        if (clansNum <= 0) {
            throw new Error("ClansController.AddClans: clansNum can't be negative or 0")
        }
        if (!this.hexGrid.HasHexagon(axial)) {
            throw new Error(`ClansController.AddClans: no hexagon with axial:${axial}`)
        }
        const hex: Hexagon = this.hexGrid.GetHex(axial)!
        const field: Field = hex.field
        if (clansNum > player.clansLeft) {
            throw new Error(`ClansController.AddClans: player not enoght clans left`)
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
    }
    public RemoveClans(player: Player, clansNum: number, axial: axialCoordiantes): void {
        if (clansNum <= 0) {
            throw new Error("ClansController.RemoveClans: clansNum can't be negative or 0")
        }
        if (!this.hexGrid.HasHexagon(axial)) {
            throw new Error(`ClansController.RemoveClans: no hexagon with axial:${axial}`)
        }
        const hex: Hexagon = this.hexGrid.GetHex(axial)!;
        const field: Field = hex.field;
        if (!field.playersClans.hasOwnProperty(player.id)) {
            throw new Error("ClansController.RemoveClans: the player has no clans to remove on field")
        }
        const playerCurrentClans = field.playersClans[player.id];
        if (clansNum > playerCurrentClans) {
            throw new Error("ClansController.RemoveClans: the clansNum can't be larger than currentClans on field")
        }
        if (clansNum === playerCurrentClans) {
            const playerFieldsPresence = this.playerFieldPresense.get(player.id)!;
            this.playerFieldPresense.set(player.id, playerFieldsPresence.filter(h => h !== hex));
            delete field.playersClans[player.id];
        } else {
            field.playersClans[player.id] = playerCurrentClans - clansNum;
        }
        player.clansLeft += clansNum;
    }
    public MoveClans(player: Player, axialFrom: axialCoordiantes, axialTo: axialCoordiantes, clansNum: number) {
        if (clansNum <= 0) {
            throw new Error("ClansController.MoveClans: clansNum can't be negative or 0")
        }
        if (!this.hexGrid.HasHexagon(axialFrom)) {
            throw new Error(`ClansController.MoveClans: no hexagon with axial:${axialFrom}`)
        }
        if (!this.hexGrid.HasHexagon(axialTo)) {
            throw new Error(`ClansController.MoveClans: no hexagon with axial:${axialTo}`)
        }
        const hexFrom: Hexagon = this.hexGrid.GetHex(axialFrom)!
        const hexTo: Hexagon = this.hexGrid.GetHex(axialTo)!
        if (!hexFrom.field.playersClans.hasOwnProperty(player.id)) {
            throw new Error("ClansController.MoveClans: the player has no clans to move from field")
        }
        const playerCurrentClans = hexFrom.field.playersClans[player.id];
        if (clansNum > playerCurrentClans) {
            throw new Error("ClansController.MoveClans: the clansNum can't be larger than currentClans on field")
        }
        const playerFieldsPresence: Hexagon[] = this.playerFieldPresense.get(player.id)!;
        if (clansNum === playerCurrentClans) {
            this.playerFieldPresense.set(player.id, playerFieldsPresence.filter(h => h !== hexFrom));
            delete hexFrom.field.playersClans[player.id];
        } else {
            hexFrom.field.playersClans[player.id] = playerCurrentClans - clansNum;
        }
        if (hexTo.field.playersClans.hasOwnProperty(player.id)) {
            const currentClans = hexTo.field.playersClans[player.id]
            hexTo.field.playersClans[player.id] = currentClans! + clansNum
        } else {
            hexTo.field.playersClans[player.id] = clansNum
        }
        if (!playerFieldsPresence.includes(hexTo)) {
            playerFieldsPresence.push(hexTo)
        }
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
    public holiday: Hexagon | undefined = undefined
    sanctuariesLeft: number = 0
    citadelsLeft: number = 0
    constructor(hexGrid: HexGrid) {
        this.hexGrid = hexGrid
    }
    public AddRandomField(axial: axialCoordiantes): void {
        const key = AxialToString(axial);
        if (this.hexGrid.HasHexagon(axial)) {
            console.log("addHex error, grid has")
            throw Error("FieldsController.AddRandomField: the hexagon is already taken")
        }
        if (!this.hexGrid.CanPlaceFieldBetween(axial)) {
            throw Error("FieldsController.AddRandomField: error placing hexagon")
        }
        if (this.avalibleTerritories.length < 0) {
            throw Error("FieldsController.AddRandomField: no territories left")
        }
        const territoryId = this.avalibleTerritories.pop()!
        const hexagon = new Hexagon(axial, new Field(territoryId));
        this.avalibleTerritories.filter(t => t !== territoryId)
        this.hexGrid.grid.set(key, hexagon);
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
    public SetHolidayField(axial: axialCoordiantes) {
        if (!this.hexGrid.HasHexagon(axial)) {
            return
        }
        const hex: Hexagon = this.hexGrid.grid.get(AxialToString(axial))!
        this.holiday = hex
        return
    }
}
export class HexGrid {
    public grid: Map<string, Hexagon> = new Map<string, Hexagon>();
    public fieldsController: FieldsController = new FieldsController(this)
    public clansController: ClansController = new ClansController(this, this.fieldsController.playerFieldPresense)
    public setupController: SetupController
    public gameState: GameState
    constructor(gameState: GameState) {
        this.gameState = gameState
        this.setupController = new SetupController(gameState)

    }
    public GetAllValidPlacements(): axialCoordiantes[] {
        const validPlacements: axialCoordiantes[] = [];

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
                    validPlacements.push({ q, r });
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
    public GetHex(axial: axialCoordiantes): Hexagon | undefined {
        return this.grid.get(AxialToString(axial))
    }
}
