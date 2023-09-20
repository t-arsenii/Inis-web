import { Player } from "../Player";
import { GameState } from "../GameState";
import { HexGrid, Hexagon } from "../HexGrid/HexGrid";
import { axialCoordiantes } from "../../types/Types";
import { Sanctuary, cardActionsMap } from "../../constans/constans_cards";
import { SanctuaryActionInfo } from "./cardActionsInfo";
import { ICardOperationParams } from "../../types/Interfaces";
import { Deck, DeckManager } from "../DeckManager";
export function BardAction({ gameState, player }: ICardOperationParams): void {
    //Giving player Epos card
}
export function DruidAction({ gameState, player, targetCardId }: ICardOperationParams) {
    if (!targetCardId) {
        return
    }
    const deckManager: DeckManager = gameState.deckManager
    const deck: Deck = deckManager.playersDeck.get(player.id)!
    if (deck.ActionCards.length === 1) {
        return
    }
    if (!cardActionsMap.has(targetCardId)) {
        return
    }
    if (!deckManager.currentDiscard.includes(targetCardId)) {
        return
    }
    deckManager.currentDiscard = deckManager.currentDiscard.filter(cId => cId !== targetCardId)
    deckManager.addCard(player, targetCardId)


}
export function PeasantsWorkersAction({ gameState, player, axialToNum }: ICardOperationParams): void {
    if (!axialToNum) {
        return
    }
    const playerHex: Hexagon[] = gameState.map.GetPlayerHex(player)!
    let citadelNum: number = 0
    playerHex.forEach(hex => {
        if (hex.field.citadelsCount > 0) {
            citadelNum++
        }
    })
    if (citadelNum === 0) {
        return
    }

    if (Array.isArray(axialToNum)) {
        const clansNum = axialToNum.map(axNum => axNum.num).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        if (clansNum > player.clansLeft) {
            return
        }
        for (var axNum of axialToNum) {
            let hex: Hexagon | undefined = gameState.map.GetHex(axNum.axial)
            if (!hex) {
                return
            }
            if (!playerHex.includes(hex)) {
                return
            }
        }

        for (var axNum of axialToNum) {
            gameState.map.AddClans(player,axNum.num, axNum.axial)

        }
    }
}
export function SanctuaryAction({ gameState, player, axial }: ICardOperationParams): void {
    if (Array.isArray(axial) || axial === undefined || typeof axial !== 'object') {
        return
    }
    if (gameState.sanctuariesLeft <= 0) {
        return
    }
    const map: HexGrid = gameState.map
    const playerHex: Hexagon[] = map.GetPlayerHex(player)!
    const hex: Hexagon | undefined = map.GetHex(axial!)
    if (!hex) {
        return
    }
    if (!playerHex.includes(hex)) {
        return
    }
    gameState.sanctuariesLeft--
    hex.field.sanctuaryCount++
    //Add Epos card to player
}
export function CitadelAction({ gameState, player, axial }: ICardOperationParams): void {
    if (Array.isArray(axial) || axial === undefined || typeof axial !== 'object') {
        return
    }
    if (gameState.citadelsLeft <= 0) {
        return
    }
    const map: HexGrid = gameState.map
    const playerHex: Hexagon[] = map.GetPlayerHex(player)!
    const hex: Hexagon | undefined = map.GetHex(axial!)
    if (!hex) {
        return
    }
    if (!playerHex.includes(hex)) {
        return
    }
    gameState.citadelsLeft--
    hex.field.citadelsCount++
    //Add Advantage card to player is possible
}
export function NewClansAction({ gameState, player, axial }: ICardOperationParams): void {
    if (!axial) {
        return
    }
    if (Array.isArray(axial)) {
        if (axial.length !== 2) {
            return
        }

        const hex1: Hexagon | undefined = gameState.map.GetHex(axial[0])
        const hex2: Hexagon | undefined = gameState.map.GetHex(axial[1])
        if (!hex1 || !hex2) {
            return
        }
        const playerHex: Hexagon[] = gameState.map.GetPlayerHex(player)!
        if (!playerHex.includes(hex1) || !playerHex.includes(hex2)) {
            return
        }
        gameState.map.AddClans(player, 1, axial[0])
        gameState.map.AddClans(player, 1, axial[1])
    }

    if (typeof axial === 'object' && !Array.isArray(axial)) {
        const hex: Hexagon | undefined = gameState.map.GetHex(axial)
        if (!hex) {
            return
        }
        const playerHex: Hexagon[] = gameState.map.GetPlayerHex(player)!
        if (!playerHex.includes(hex)) {
            return
        }
        gameState.map.AddClans(player, 1, axial)
    }

}