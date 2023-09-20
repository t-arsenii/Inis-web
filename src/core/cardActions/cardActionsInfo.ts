import { AxialToString } from "../../services/helperFunctions"
import { ICardOperationResponse } from "../../types/Interfaces"
import { Deck, DeckManager } from "../DeckManager"
import { GameState } from "../GameState"
import { Hexagon } from "../HexGrid/HexGrid"
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