import { shuffle, AxialToString } from "../../utils/helperFunctions";
import { axialCoordinates } from "../../types/Types";
import { Player } from "../Player";
import { territoryMap } from "../constans/constant_territories";
import { HexGrid } from "./HexGrid";
import { Hexagon, Field } from "./HexagonField";


export class FieldsController {
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
        const territoryId = this.avalibleTerritories.pop()!
        const hexagon = new Hexagon(axial, new Field(territoryId, this.hexGrid.gameState));
        this.avalibleTerritories.filter(t => t !== territoryId)
        this.hexGrid.grid.set(key, hexagon);
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
        const hex: Hexagon = this.hexGrid.grid.get(AxialToString(axial))!
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
}