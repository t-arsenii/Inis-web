import { shuffle, AxialToString } from "../../utils/helperFunctions";
import { axialCoordinates } from "../../types/Types";
import { Player } from "../Player";
import { territoryMap } from "../constans/constant_territories";
import { HexGridManager } from "./HexGridManager";
import { Hexagon, Field } from "./Field";


export class FieldsController {
    private hexGrid: HexGridManager;
    public playerFieldPresense: Map<string, Hexagon[]>;
    public avalibleTerritories: string[];
    public capitalHex: Hexagon | null;
    public festivalHex: Hexagon | null;
    sanctuariesLeft: number;
    citadelsLeft: number;
    constructor(hexGrid: HexGridManager) {
        this.playerFieldPresense = new Map();
        this.hexGrid = hexGrid
        this.avalibleTerritories = shuffle(Array.from(territoryMap.keys()))
        //
        this.capitalHex = null;
        this.festivalHex = null;
        //
        this.sanctuariesLeft = 0;
        this.citadelsLeft = 0;
    }
    public AddRandomField(axial: axialCoordinates): void {
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
        const territoryId = this.avalibleTerritories.pop()!;
        const hexagon = new Hexagon(axial, new Field(territoryId, this.hexGrid._gameState));
        this.avalibleTerritories.filter(t => t !== territoryId)
        this.hexGrid.hexGrid.set(key, hexagon);
    }
    public SetCapital(axial: axialCoordinates): void {
        const hex = this.hexGrid.GetHex(axial);
        if (!hex) {
            throw new Error("FieldsController.SetCapital: ")
        }
        this.capitalHex = hex
        hex.field.citadelsCount++
    }
    public GetPlayerHex(player: Player): Hexagon[] | undefined {
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
    public SetHolidayField(axial: axialCoordinates) {
        if (!this.hexGrid.HasHexagon(axial)) {
            throw new Error("FieldsController.SetHolidayField: axial not found")
        }
        const hex: Hexagon = this.hexGrid.hexGrid.get(AxialToString(axial))!
        this.festivalHex = hex
    }
    public ResetHolidayField() {
        this.festivalHex = null
    }
    AddSanctuary(axial: axialCoordinates) {
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
    IsLeader(player: Player, axial: axialCoordinates): boolean {
        if (!this.hexGrid.HasHexagon(axial)) {
            throw new Error("No hexagon found");
        }
        const hex = this.hexGrid.GetHex(axial)!;
        return hex.field.leaderPlayerId === player.id;
    }
}