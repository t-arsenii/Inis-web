import { trixelCondition_oOWJ5 } from "../../constans/constant_trixelConditions";
import { ICardOperationParams } from "../../types/Interfaces";
import { HexGrid, Hexagon } from "../HexGrid";

//пустошь, лес, каменный круг, долина, железный рудник, горы
export function WastelandAdvantage({ gameState, player, targetPlayerId }: ICardOperationParams) {
    //Can be played in any time
    if (!targetPlayerId) {
        throw new Error("WastelandAdvantage: targetPlayerId undefiend")
    }
    if (!gameState.players.has(targetPlayerId)) {
        throw new Error("WastelandAdvantage: targetPlayer not found")
    }
    const eposCards = gameState.deckManager.playersDeck.get(targetPlayerId)?.EposCards
    return eposCards
}
export function ValleyAdvantage({ gameState, player, axial }: ICardOperationParams) {
    if (!gameState.trixelManager.HasTrixel(player, trixelCondition_oOWJ5)) {
        throw new Error("ValleyAdvantage: player dosen't have condition to play trixel")
    }
    if (Array.isArray(axial) || axial === undefined || typeof axial !== 'object') {
        throw new Error(`ValleyAdvantage: axial field error`)
    }
    const map: HexGrid = gameState.map
    if (!gameState.map.GetHex(axial)) {
        throw new Error(`ValleyAdvantage: no hexagon with axial:${axial}`)
    }
    const hex: Hexagon = map.GetHex(axial)!
    const playerHex: Hexagon[] = map.fieldsController.GetPlayerHex(player)!
    if (!playerHex.includes(hex)) {
        throw new Error(`ValleyAdvantage: player is not present on axial:${axial}`)
    }
    gameState.map.clansController.AddClans(player, 1, axial)
}