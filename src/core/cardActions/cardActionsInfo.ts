import { Deck, DeckManager } from "../DeckManager"
import { GameState } from "../GameState"
import { Hexagon } from "../HexGrid/HexGrid"
import { Player } from "../Player"
export function BardActionInfo(gameState: GameState, player: Player) {
    //Don't know what info to return yet
}
export function DruidActionInfo(gameState: GameState, player: Player) {
    const deckManager: DeckManager = gameState.deckManager
    return deckManager.currentDiscard

}
export function SanctuaryActionInfo(gameState: GameState, player: Player): Hexagon[] | undefined {
    const hexArr: Hexagon[] | undefined = gameState.map.GetPlayerHex(player)
    if (!hexArr) {
        return undefined
    }
    return hexArr
}
export function CitadelActionInfo(gameState: GameState, player: Player): Hexagon[] | undefined {
    const hexArr: Hexagon[] | undefined = gameState.map.GetPlayerHex(player)
    if (!hexArr) {
        return undefined
    }
    return hexArr
}
export function NewClansActionInfo(gameState: GameState, player: Player): Hexagon[] | undefined {
    const hexArr: Hexagon[] | undefined = gameState.map.GetPlayerHex(player)
    if (!hexArr) {
        return undefined
    }
    return hexArr
}