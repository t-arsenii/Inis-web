import { GameState } from "../gameState/GameState"
import { Player } from "../core/Player"
import { Badge, Card_type, StartStructure, Timing_to_play, TurnOrder } from "./Enums"
export type Card = {
    readonly id: string,
    readonly title: string,
    readonly card_type: Card_type,
    readonly timing: Timing_to_play,
    readonly badge: Badge,
    readonly description?: string,
    readonly trixelCondition?: string,
    readonly secondDescription?: string
}
export type TrixelCondition = {
    readonly id: string,
    readonly description: string
}
export type Territory = {
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
export type PlayerTurnOrder = {
    playersId: string[],
    direction: TurnOrder,
    activePlayerId: string;
}
export type playerInfo = {
    gameState: GameState
    player: Player
}
export type AttackerCycle = {
    status: boolean,
    attackerPlayerId: string | null,
    defenderPlayerId: string | null
}
export type PretenderTokens = {
    sanctuaries: boolean,
    clans: boolean,
    territories: boolean
}
export type DealCards = {
    cardsToDiscardNum: number,
    players: Record<string, { cards: string[], cardsToDiscard: string[], readyToDeal: boolean }>
}