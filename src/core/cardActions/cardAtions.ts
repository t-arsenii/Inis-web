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
    const playerHex: Hexagon[] = gameState.map.fieldsController.GetPlayerHex(player)!
    let citadelNum: number = gameState.map.fieldsController.CountPlayerCitadels(player)

    if (Array.isArray(axialToNum)) {
        const clansNum = axialToNum.map(axNum => axNum.num).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        if (clansNum > player.clansLeft || clansNum !== citadelNum) {
            return
        }
        for (var axNum of axialToNum) {
            if (!gameState.map.HasHexagon(axNum.axial)) {
                return
            }
            let hex: Hexagon = gameState.map.GetHex(axNum.axial)!
            if (!playerHex.includes(hex)) {
                return
            }
        }
        for (var axNum of axialToNum) {
            gameState.map.clansController.AddClans(player, axNum.num, axNum.axial)

        }
    }

    if (typeof axialToNum === 'object' && !Array.isArray(axialToNum)) {
        const clansNum = axialToNum.num
        if (clansNum > player.clansLeft) {
            return
        }
        if (!gameState.map.HasHexagon(axialToNum.axial)) {
            return
        }
        let hex: Hexagon = gameState.map.GetHex(axialToNum.axial)!
        if (!playerHex.includes(hex)) {
            return
        }
        gameState.map.clansController.AddClans(player, axialToNum.num, axialToNum.axial)

    }

}
export function SanctuaryAction({ gameState, player, axial }: ICardOperationParams): void {
    if (Array.isArray(axial) || axial === undefined || typeof axial !== 'object') {
        return
    }
    if (gameState.map.fieldsController.sanctuariesLeft <= 0) {
        return
    }
    const map: HexGrid = gameState.map
    const playerHex: Hexagon[] = map.fieldsController.GetPlayerHex(player)!
    const hex: Hexagon | undefined = map.GetHex(axial!)
    if (!hex) {
        return
    }
    if (!playerHex.includes(hex)) {
        return
    }
    gameState.map.fieldsController.sanctuariesLeft--
    hex.field.sanctuaryCount++
    //Add Epos card to player
}
export function CitadelAction({ gameState, player, axial }: ICardOperationParams): void {
    if (Array.isArray(axial) || axial === undefined || typeof axial !== 'object') {
        return
    }
    if (gameState.map.fieldsController.citadelsLeft <= 0) {
        return
    }
    if (!gameState.map.HasHexagon(axial)) {
        return
    }
    const hex: Hexagon = gameState.map.GetHex(axial)!
    const playerHex: Hexagon[] = gameState.map.fieldsController.GetPlayerHex(player)!
    if (!playerHex.includes(hex)) {
        return
    }
    gameState.map.fieldsController.citadelsLeft--
    hex.field.citadelsCount++
    //Add Advantage card to player if possible
}
export function NewClansAction({ gameState, player, axial }: ICardOperationParams): void {
    if (!axial) {
        return
    }
    if (Array.isArray(axial)) {
        if (axial.length !== 2) {
            return
        }
        if (!gameState.map.HasHexagon(axial[0]) || !gameState.map.HasHexagon(axial[1])) {
            return
        }
        const hex1: Hexagon = gameState.map.GetHex(axial[0])!
        const hex2: Hexagon = gameState.map.GetHex(axial[1])!
        const playerHex: Hexagon[] = gameState.map.fieldsController.GetPlayerHex(player)!
        if (!playerHex.includes(hex1) || !playerHex.includes(hex2)) {
            return
        }
        gameState.map.clansController.AddClans(player, 1, axial[0])
        gameState.map.clansController.AddClans(player, 1, axial[1])
    }

    if (typeof axial === 'object' && !Array.isArray(axial)) {
        if (!gameState.map.HasHexagon(axial)) {
            return
        }
        const hex: Hexagon = gameState.map.GetHex(axial)!
        const playerHex: Hexagon[] = gameState.map.fieldsController.GetPlayerHex(player)!
        if (!playerHex.includes(hex)) {
            return
        }
        gameState.map.clansController.AddClans(player, 2, axial)
    }

}