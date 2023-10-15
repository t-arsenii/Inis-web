import { AxialToString, hexToAxialCoordinates } from "./helperFunctions";
import { Field, HexGrid, Hexagon } from "../core/map/HexGrid";
import { axialCoordiantes } from "../types/Types";
import { territoryMap } from "../core/constans/constant_territories";
export function HexGridToJson(hexGrid: HexGrid) {
    let capitalCoordinates: axialCoordiantes | null = null
    if (hexGrid.fieldsController.capitalHex) {
        capitalCoordinates = hexToAxialCoordinates(hexGrid.fieldsController.capitalHex);
    }
    let holidayCoordinates: axialCoordiantes | null = null
    if (hexGrid.fieldsController.festivalHex) {
        holidayCoordinates = hexToAxialCoordinates(hexGrid.fieldsController.festivalHex);
    }
    const avalibleTerArray = hexGrid.fieldsController.avalibleTerritories.map(id => territoryMap.get(id)!.title);
    return { capital: capitalCoordinates, holiday: holidayCoordinates, hexGrid: Array.from(hexGrid.grid.values()).map(hex => ({ q: hex.q, r: hex.r, field: hex.field })), avalibleTer: avalibleTerArray };

}
export function InitHexGrid(hexGrid: HexGrid): void {
    if (hexGrid.grid.size > 0) {
        return
    }
    const t1Id = hexGrid.fieldsController.avalibleTerritories.pop()!
    const t2Id = hexGrid.fieldsController.avalibleTerritories.pop()!
    const t3Id = hexGrid.fieldsController.avalibleTerritories.pop()!

    hexGrid.gameState.players.forEach((player, playerId) => {
        hexGrid.fieldsController.playerFieldPresense.set(playerId, [])
    })

    const hex1 = new Hexagon({ q: 0, r: 0 }, new Field(t1Id, hexGrid.gameState))
    const hex2 = new Hexagon({ q: 1, r: 0 }, new Field(t2Id, hexGrid.gameState))
    const hex3 = new Hexagon({ q: 0, r: 1 }, new Field(t3Id, hexGrid.gameState))

    hexGrid.grid.set(AxialToString({ q: hex1.q, r: hex1.r }), hex1);
    hexGrid.grid.set(AxialToString({ q: hex2.q, r: hex2.r }), hex2);
    hexGrid.grid.set(AxialToString({ q: hex3.q, r: hex3.r }), hex3);
}