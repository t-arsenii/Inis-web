import { StoneCircle } from "../constans/constant_advantage_cards";
import { territoryMap } from "../constans/constant_territories";
import { trixelCondition_1WIFg, trixelCondition_NzLys, trixelCondition_oOWJ5 } from "../constans/constant_trixelConditions";
import { ICardOperationParams } from "../../types/Interfaces";
import { HexGrid, Hexagon } from "../HexGrid";

//пустошь, лес, каменный круг, долина, холмы, горы
export function WastelandTrixel({ gameState, player, targetPlayerId }: ICardOperationParams) {
    //Can be played in any time
    if (!targetPlayerId) {
        throw new Error("WastelandTrixel: targetPlayerId undefiend")
    }
    if (!gameState.players.has(targetPlayerId)) {
        throw new Error("WastelandTrixel: targetPlayer not found")
    }
    const eposCards = gameState.deckManager.playersDeck.get(targetPlayerId)?.EposCards
    return eposCards
}
export function ValleyTrixel({ gameState, player, axial }: ICardOperationParams) {
    if (!gameState.trixelManager.HasTrixel(player, trixelCondition_oOWJ5)) {
        throw new Error("ValleyTrixel: player dosen't have condition to play trixel")
    }
    if (Array.isArray(axial) || axial === undefined || typeof axial !== 'object') {
        throw new Error(`ValleyTrixel: axial field error`)
    }
    const map: HexGrid = gameState.map
    if (!gameState.map.GetHex(axial)) {
        throw new Error(`ValleyTrixel: no hexagon with axial:${axial}`)
    }
    const hex: Hexagon = map.GetHex(axial)!
    const playerHex: Hexagon[] = map.fieldsController.GetPlayerHex(player)!
    if (!playerHex.includes(hex)) {
        throw new Error(`ValleyTrixel: player is not present on axial:${axial}`)
    }
    gameState.map.clansController.AddClans(player, 1, axial)
}
export function ForestTrixel({ gameState, player }: ICardOperationParams) {
    if (!gameState.trixelManager.HasTrixel(player, trixelCondition_1WIFg)) {
        throw new Error("ForestTrixel: player dosen't have condition to play trixel")
    }
    gameState.deckManager.AddRandomEposCard(player)
}
export function StoneCircleTrixel({ gameState, player }: ICardOperationParams) {
    if (!gameState.trixelManager.HasTrixel(player, trixelCondition_1WIFg)) {
        throw new Error("StoneCircleTrixel: player dosen't have condition to play trixel")
    }
    const hexArr: Hexagon[] = gameState.map.GetAllHex()
    const stoneCircle = hexArr.find(hex => hex.field.territoryId === StoneCircle.id)
    if (!stoneCircle) {
        throw new Error("StoneCircleTrixel: player dosen't have condition to play trixel")
    }
    if (!stoneCircle.field.hasClans(player)) {
        throw new Error("StoneCircleTrixel: player has no clans")
    }
    gameState.map.clansController.RemoveClans(player, 1, { q: stoneCircle.q, r: stoneCircle.r })
    const lastEposCardId = gameState.deckManager.eposDiscard.pop()!
    gameState.deckManager.AddCard(player, lastEposCardId)
}
export function HillsTrixel({ gameState, player }: ICardOperationParams) {
    if (!gameState.trixelManager.HasTrixel(player, trixelCondition_NzLys)) {
        throw new Error("HillsTrixel: player dosen't have condition to play trixel")
    }
    if (!gameState.fightManager.currentFight || !gameState.fightManager.currentFight.attackCycle || gameState.fightManager.currentFight.attackCycle.defenderPlayerId !== player.id) {
        throw new Error("HillsTrixel: trixel logic error")
    }
    gameState.fightManager.SkipDeffenderAction(player)
}
export function SwampSeason({ gameState, player }: ICardOperationParams) {
    gameState.NextTurn()
}