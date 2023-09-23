import { AxialToString } from "../../services/helperFunctions"
import { ICardOperationResponse } from "../../types/Interfaces"
import { axialCoordiantes } from "../../types/Types"
import { Deck, DeckManager } from "../DeckManager"
import { GameState } from "../GameState"
import { Hexagon } from "../HexGrid"
import { Player } from "../Player"
export function BardActionInfo(gameState: GameState, player: Player): ICardOperationResponse {
    //Don't know what info to return yet
    return {}
}
export function DruidActionInfo(gameState: GameState, player: Player): ICardOperationResponse {
    const deckManager: DeckManager = gameState.deckManager
    return { cardId: deckManager.currentDiscard }

}
export function PeasantsWorkersActionInfo(gameState: GameState, player: Player): ICardOperationResponse {
    const playerHex: Hexagon[] | undefined = gameState.map.fieldsController.GetPlayerHex(player)
    if (!playerHex) {
        return {}
    }
    const citadelNum: number = gameState.map.fieldsController.CountPlayerCitadels(player)
    return { axial: playerHex.map(hex => ({ q: hex.q, r: hex.r })), num: citadelNum }
}
export function SanctuaryActionInfo(gameState: GameState, player: Player): ICardOperationResponse {
    const hexArr: Hexagon[] | undefined = gameState.map.fieldsController.GetPlayerHex(player)
    if (!hexArr) {
        return {}
    }
    return { axial: hexArr.map(hex => ({ q: hex.q, r: hex.r })) }
}
export function CitadelActionInfo(gameState: GameState, player: Player): ICardOperationResponse {
    const hexArr: Hexagon[] | undefined = gameState.map.fieldsController.GetPlayerHex(player)
    if (!hexArr) {
        return {}
    }
    return { axial: hexArr.map(hex => ({ q: hex.q, r: hex.r })) }
}
export function NewClansActionInfo(gameState: GameState, player: Player): ICardOperationResponse {
    const hexArr: Hexagon[] | undefined = gameState.map.fieldsController.GetPlayerHex(player)
    if (!hexArr) {
        return {}
    }
    return { axial: hexArr.map(hex => ({ q: hex.q, r: hex.r })) }
}
export function ExplorationActionInfo(gameState: GameState, player: Player): ICardOperationResponse {
    const axialArr: axialCoordiantes[] = gameState.map.GetAllValidPlacements()
    if (!axialArr) {
        return {}
    }
    return { axial: axialArr }
}
export function HolidayActionInfo(gameState: GameState, player: Player): ICardOperationResponse {
    const hexArr: Hexagon[] | undefined = gameState.map.fieldsController.GetPlayerHex(player)
    if (!hexArr) {
        return {}
    }
    const hexSanctArr: Hexagon[] = hexArr.filter(hex => hex.field.sanctuaryCount > 0)
    if (hexSanctArr.length === 0) {
        return {}
    }
    return { axial: hexSanctArr.map(hex => ({ q: hex.q, r: hex.r })) }
}