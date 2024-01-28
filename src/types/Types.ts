import { Player } from "../core/Player"
import { GameState } from "../core/gameState/GameState"
import { Badge, Card_type, StartStructure, Timing_to_play, TurnOrder } from "./Enums"
export type CardType = {
    readonly id: string,
    readonly title: string,
    readonly card_type: Card_type,
    readonly timing: Timing_to_play,
    readonly badge: Badge,
    readonly description?: string,
    readonly trixelCondition?: string,
    readonly secondDescription?: string
}
export type TrixelConditionType = {
    readonly id: string,
    readonly description: string
}
export type TerritoryType = {
    id: string,
    title: string
    description: string
    cardId: string
    startStructure?: StartStructure
}
export type axialCoordinates = {
    q: number
    r: number
}
export type PlayerTurnOrderType = {
    playersId: string[],
    direction: TurnOrder,
    activePlayerId: string;
}
export type PlayerInfoType = {
    gameState: GameState
    player: Player
}
export type AttackerCycleType = {
    status: boolean,
    attackerPlayerId: string | null,
    defenderPlayerId: string | null
}
export type PretenderTokensType = {
    sanctuaries: boolean,
    clans: boolean,
    territories: boolean
}
export type DealCardsType = {
    cardsToDiscardNum: number,
    players: Record<string, { cards: string[], cardsToDiscard: string[], readyToDeal: boolean }>
}
export type MoveDataType = {
    singleAxial: axialCoordinates,
    axialToNum: { axial: axialCoordinates, num: number }[]
}
export type axialToNum = {
    axial: axialCoordinates, num: number
}