import { Player } from "../Player"
import { AxialToString, hexToAxialCoordinates, getKeysWithMaxValue, shuffle } from "../../services/helperFunctions"
import { GameState } from "../GameState"
import { territoryMap } from "../constans/constant_territories"
import { axialCoordiantes } from "../../types/Types"
export class Field {
    territoryId: string = ""
    sanctuaryCount: number = 0
    citadelsCount: number = 0
    playersClans: Map<string, number> = new Map()
    leaderPlayerId: string | null = null
    gameState: GameState
    constructor(terId: string, gameState: GameState) {
        this.territoryId = terId
        this.gameState = gameState
    }
    toJSON() {
        const { territoryId, sanctuaryCount, citadelsCount, leaderPlayerId } = this
        const playerClans = Object.fromEntries(this.playersClans)
        return {
            territoryId,
            sanctuaryCount,
            citadelsCount,
            leaderPlayerId,
            playerClans
        }
    }
    UpdateLeader(): void {
        if (this.playersClans.size <= 0) {
            this.leaderPlayerId = null;
            return
        }
        //maybe unnecessary check
        if (!this.gameState.brenPlayer) {
            throw new Error("")
        }

        if (this.playersClans.size === 1) {
            const [singleKey] = this.playersClans.keys();
            this.leaderPlayerId = singleKey;
            return;
        }
        const maxClansPlayersKeys: string[] = getKeysWithMaxValue(this.playersClans);
        if (maxClansPlayersKeys.length === 1) {
            this.leaderPlayerId = maxClansPlayersKeys[0]
            return
        }
        if (maxClansPlayersKeys.includes(this.gameState.brenPlayer.id)) {
            this.leaderPlayerId = this.gameState.brenPlayer.id
            return
        }
        this.leaderPlayerId = null;
    }
    hasClans(player: Player): boolean {
        return this.playersClans.has(player.id)
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
        if (field.playersClans.has(player.id)) {
            const currentClans = field.playersClans.get(player.id)!
            field.playersClans.set(player.id, currentClans + clansNum)
        } else {
            field.playersClans.set(player.id, clansNum)
        }
        player.clansLeft -= clansNum
        const playerFieldsPresense: Hexagon[] = this.playerFieldPresense.get(player.id)!
        if (!playerFieldsPresense.includes(hex)) {
            playerFieldsPresense.push(hex)
        }
        hex.field.UpdateLeader()
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
        if (!field.playersClans.has(player.id)) {
            throw new Error("ClansController.RemoveClans: the player has no clans to remove on field")
        }
        const playerCurrentClans = field.playersClans.get(player.id)!;
        if (clansNum > playerCurrentClans) {
            throw new Error("ClansController.RemoveClans: the clansNum can't be larger than currentClans on field")
        }
        if (clansNum === playerCurrentClans) {
            const playerFieldsPresence = this.playerFieldPresense.get(player.id)!;
            this.playerFieldPresense.set(player.id, playerFieldsPresence.filter(h => h !== hex));
            field.playersClans.delete(player.id);
        } else {
            field.playersClans.set(player.id, playerCurrentClans - clansNum);
        }
        player.clansLeft += clansNum;
        hex.field.UpdateLeader()
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
        if (!hexFrom.field.playersClans.has(player.id)) {
            throw new Error("ClansController.MoveClans: the player has no clans to move from field")
        }
        const playerCurrentClans = hexFrom.field.playersClans.get(player.id)!;
        if (clansNum > playerCurrentClans) {
            throw new Error("ClansController.MoveClans: the clansNum can't be larger than currentClans on field")
        }
        const playerFieldsPresence: Hexagon[] = this.playerFieldPresense.get(player.id)!;
        if (clansNum === playerCurrentClans) {
            this.playerFieldPresense.set(player.id, playerFieldsPresence.filter(h => h !== hexFrom));
            hexFrom.field.playersClans.delete(player.id);
        } else {
            hexFrom.field.playersClans.set(player.id, playerCurrentClans - clansNum);
        }
        if (hexTo.field.playersClans.has(player.id)) {
            const currentClans = hexTo.field.playersClans.get(player.id)!
            hexTo.field.playersClans.set(player.id, currentClans! + clansNum)
        } else {
            hexTo.field.playersClans.set(player.id, clansNum)
        }
        if (!playerFieldsPresence.includes(hexTo)) {
            playerFieldsPresence.push(hexTo)
        }

        //checking holiday token
        if (this.hexGrid.fieldsController.festivalHex == hexTo) {
            this.RemoveClans(player, 1, hexToAxialCoordinates(hexTo))
        }
        //updating field leader
        hexTo.field.UpdateLeader()
        hexFrom.field.UpdateLeader()
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
    private hexGrid: HexGrid;
    public playerFieldPresense: Map<string, Hexagon[]> = new Map();
    public avalibleTerritories: string[];
    public capitalHex: Hexagon | null = null;
    public festivalHex: Hexagon | null = null;
    sanctuariesLeft: number = 0;
    citadelsLeft: number = 0;
    constructor(hexGrid: HexGrid) {
        this.hexGrid = hexGrid
        this.avalibleTerritories = shuffle(Array.from(territoryMap.keys()))
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
        const hexagon = new Hexagon(axial, new Field(territoryId, this.hexGrid.gameState));
        this.avalibleTerritories.filter(t => t !== territoryId)
        this.hexGrid.grid.set(key, hexagon);
    }
    public SetCapital(axial: axialCoordiantes): void {
        const hex = this.hexGrid.GetHex(axial);
        if (!hex) {
            throw new Error("FieldsController.SetCapital: ")
        }
        this.capitalHex = hex
        hex.field.citadelsCount++
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
            throw new Error("FieldsController.SetHolidayField: axial not found")
        }
        const hex: Hexagon = this.hexGrid.grid.get(AxialToString(axial))!
        this.festivalHex = hex
    }
    public ResetHolidayField() {
        this.festivalHex = null
    }
    AddSanctuary(axial: axialCoordiantes) {
        const hex = this.hexGrid.GetHex(axial)!;
        if (!hex) {
            throw new Error("FieldsController.AddSanctuary: ");
        }
        if (this.sanctuariesLeft < 1) {
            throw new Error("FieldsController.AddSanctuary: no sanctuaries left");
        }
        hex.field.sanctuaryCount++;
        this.sanctuariesLeft--;

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
    public GetNeighbors(axial: axialCoordiantes): Hexagon[] {
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
    public CanPlaceFieldBetween(axial: axialCoordiantes): boolean {
        if (!this.HasHexagon(axial)) {
            const neighbors = this.GetNeighbors(axial);
            if (neighbors.length >= 2) {
                return true;
            }
        }
        return false;
    }
    public HasHexagon(axial: axialCoordiantes): boolean {
        const key = AxialToString(axial);
        return this.grid.has(key);
    }
    public GetHex(axial: axialCoordiantes): Hexagon | undefined {
        return this.grid.get(AxialToString(axial))
    }
    public GetAllHex(): Hexagon[] {
        return Array.from(this.grid.values())
    }
}
