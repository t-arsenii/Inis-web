import { ICardOperationParams, ICardOperationResponse, ICardParams } from "../../types/Interfaces"
import { MoveDataType, axialCoordinates, axialToNum } from "../../types/Types"
import { hexToAxialCoordinates } from "../../utils/helperFunctions"
import { Deck, DeckManager } from "../DeckManager"
import { Hexagon } from "../map/Field"
export function SanctuaryActionInfo({ gameState, player }: ICardOperationParams): ICardOperationResponse {
    const hexArr: Hexagon[] | undefined = gameState.hexGridManager.fieldsController.GetPlayerHex(player)
    if (!hexArr) {
        return {}
    }
    return { axial: hexArr.map(hex => ({ q: hex.q, r: hex.r })), maxTerClicks: 1 };
}
export function NewClansActionInfo({ gameState, player }: ICardOperationParams): ICardOperationResponse {
    const hexArr: Hexagon[] | undefined = gameState.hexGridManager.fieldsController.GetPlayerHex(player)
    if (!hexArr) {
        return {}
    }
    return { axial: hexArr.map(hex => ({ q: hex.q, r: hex.r })), maxTerClicks: 2 };
}
export function ConquestActionInfo({ gameState, player }: ICardOperationParams): ICardOperationResponse {
    const allHex = gameState.hexGridManager.GetAllHex();
    const returnData: MoveDataType[] = [];
    for (const hex of allHex) {
        const neighbourHexArr: Hexagon[] = gameState.hexGridManager.GetNeighbors(hex)
        const axialToNumRes: axialToNum[] = [];
        let isValid: boolean = false;
        for (const neighbourHex of neighbourHexArr) {
            let totalClans: number = 0;
            if (neighbourHex.field.playersClans.has(player.id)) {
                axialToNumRes.push({ axial: { q: hex.q, r: hex.r }, num: neighbourHex.field.playersClans.get(player.id)! });
                totalClans += hex.field.playersClans.get(player.id)!;
                isValid = true;
            }
        }
        if (isValid) {
            returnData.push({ singleAxial: hexToAxialCoordinates(hex), axialToNum: axialToNumRes })
        }
    }
    return { moveData: returnData };
}
export function BardActionInfo({ gameState, player }: ICardOperationParams): ICardOperationResponse {
    throw new Error("Not implemented exception");
}
export function DruidActionInfo({ gameState, player }: ICardOperationParams): ICardOperationResponse {
    const deckManager: DeckManager = gameState.deckManager;
    return { cardIds: deckManager.actionDiscard, maxCardClicks: 1 }

}
export function PeasantsWorkersActionInfo({ gameState, player }: ICardOperationParams): ICardOperationResponse {
    const playerHex: Hexagon[] | undefined = gameState.hexGridManager.fieldsController.GetPlayerHex(player);
    if (!playerHex) {
        return {};
    }
    const citadelNum: number = gameState.hexGridManager.fieldsController.CountPlayerCitadels(player);
    return { axial: playerHex.map(hex => ({ q: hex.q, r: hex.r })), maxTerClicks: citadelNum };
}
export function NewUnionActionInfo({ gameState, player, cardVariation }: ICardOperationParams): ICardOperationResponse {
    if (!cardVariation) {
        throw new Error("NewUnionSeason: card variation parameter error")
    }
    if (cardVariation === 1) {
        const playerHex: Hexagon[] | undefined = gameState.hexGridManager.fieldsController.GetPlayerHex(player);
        if (!playerHex) {
            return {};
        }
        return { axial: playerHex.map(hex => (hexToAxialCoordinates(hex))), maxTerClicks: 1 };
    }
    else if (cardVariation === 2) {
        const playerHex: Hexagon[] | undefined = gameState.hexGridManager.fieldsController.GetPlayerHex(player);
        if (!playerHex) {
            return {};
        }
        let axialToPlayerId: { axialCoordinates: axialCoordinates, playerIds: string[] }[] = []
        playerHex.forEach(hex => {
            const playerIds = Object.entries(hex.field.playersClans)
                .filter(([id, number]) => number > 1)
                .map(([id, _]) => id);
            if (playerIds.length > 0) {
                axialToPlayerId.push({ axialCoordinates: hexToAxialCoordinates(hex), playerIds })
            }
        })
        return { axialToPlayerId: axialToPlayerId, maxTargetPlayerClicks: 1 }
    }
    else {
        throw new Error("NewUnionActionInfo: CardVariation parameter error")
    }
}
export function ExplorationActionInfo({ gameState, player }: ICardOperationParams): ICardOperationResponse {
    const axialArr: axialCoordinates[] = gameState.hexGridManager.GetAllValidPlacements();
    if (!axialArr) {
        return {}
    }
    return { axial: axialArr, maxTerClicks: 1 }
}
export function CommanderActionInfo({ gameState, player, }: ICardOperationParams): ICardOperationResponse {
    throw new Error("Not implemented exception");
}
export function HolidayActionInfo({ gameState, player }: ICardOperationParams): ICardOperationResponse {
    const hexArr: Hexagon[] | undefined = gameState.hexGridManager.fieldsController.GetPlayerHex(player);
    if (!hexArr) {
        return {};
    }
    const hexSanctArr: Hexagon[] = hexArr.filter(hex => hex.field.sanctuaryCount > 0)
    if (hexSanctArr.length === 0) {
        return {};
    }
    return { axial: hexSanctArr.map(hex => ({ q: hex.q, r: hex.r })), maxTerClicks: 1 }
}
export function RelocationActionInfo({ gameState, player }: ICardOperationParams): ICardOperationResponse {
    throw new Error("Not implemented exception");
}
export function CitadelActionInfo({ gameState, player }: ICardOperationParams): ICardOperationResponse {
    const hexArr: Hexagon[] | undefined = gameState.hexGridManager.fieldsController.GetPlayerHex(player)
    if (!hexArr) {
        return {}
    }
    return { axial: hexArr.map(hex => ({ q: hex.q, r: hex.r })), maxTerClicks: 1 }
}
export function GeistActionInfo({ gameState, player }: ICardOperationParams): ICardOperationResponse {
    throw new Error("Not implemented exception");
}