import { AxialToString } from "../../services/helperFunctions"
import { ICardOperationParams, ICardOperationResponse, ICardParams } from "../../types/Interfaces"
import { axialCoordiantes } from "../../types/Types"
import { Deck, DeckManager } from "../DeckManager"
import { GameState } from "../GameState"
import { Hexagon } from "../HexGrid"
import { Player } from "../Player"
export function BardActionInfo({ gameState, player }: ICardOperationParams): ICardOperationResponse {
    //Don't know what info to return yet
    return {}
}
export function DruidActionInfo({ gameState, player }: ICardOperationParams): ICardOperationResponse {
    const deckManager: DeckManager = gameState.deckManager
    return { cardId: deckManager.currentDiscard }

}
export function PeasantsWorkersActionInfo({ gameState, player }: ICardOperationParams): ICardOperationResponse {
    const playerHex: Hexagon[] | undefined = gameState.map.fieldsController.GetPlayerHex(player)
    if (!playerHex) {
        return {}
    }
    const citadelNum: number = gameState.map.fieldsController.CountPlayerCitadels(player)
    return { axial: playerHex.map(hex => ({ q: hex.q, r: hex.r })), num: citadelNum }
}
export function SanctuaryActionInfo({ gameState, player }: ICardOperationParams): ICardOperationResponse {
    const hexArr: Hexagon[] | undefined = gameState.map.fieldsController.GetPlayerHex(player)
    if (!hexArr) {
        return {}
    }
    return { axial: hexArr.map(hex => ({ q: hex.q, r: hex.r })) }
}
export function CitadelActionInfo({ gameState, player }: ICardOperationParams): ICardOperationResponse {
    const hexArr: Hexagon[] | undefined = gameState.map.fieldsController.GetPlayerHex(player)
    if (!hexArr) {
        return {}
    }
    return { axial: hexArr.map(hex => ({ q: hex.q, r: hex.r })) }
}
export function NewClansActionInfo({ gameState, player }: ICardOperationParams): ICardOperationResponse {
    const hexArr: Hexagon[] | undefined = gameState.map.fieldsController.GetPlayerHex(player)
    if (!hexArr) {
        return {}
    }
    return { axial: hexArr.map(hex => ({ q: hex.q, r: hex.r })) }
}
export function ExplorationActionInfo({ gameState, player }: ICardOperationParams): ICardOperationResponse {
    const axialArr: axialCoordiantes[] = gameState.map.GetAllValidPlacements()
    if (!axialArr) {
        return {}
    }
    return { axial: axialArr }
}
export function HolidayActionInfo({ gameState, player }: ICardOperationParams): ICardOperationResponse {
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
export function ConquestActionInfo({ gameState, player, axial }: ICardOperationParams): ICardOperationResponse {
    if (!axial || Array.isArray(axial)) {
        throw new Error("ConquestActionInfo: axial coordinate error")
    }
    if (!gameState.map.HasHexagon(axial)) {
        throw new Error(`ConquestActionInfo: no hexagon with axial:${axial}`)
    }
    const hexArr: Hexagon[] = gameState.map.GetNeighbors(axial)
    const axialToNumRes: { axial: axialCoordiantes, num: number }[] = [];

    hexArr.forEach(hex => {
        if (hex.field.playersClans.has(player.id)) {
            axialToNumRes.push({ axial: { q: hex.q, r: hex.r }, num: hex.field.playersClans.get(player.id)! });
        }
    });

    return { axialToNum: axialToNumRes };
}