import { GameState } from "../core/GameState"
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
    id: string
    title: string
    description: string | undefined
    cardId: string
    startStructure: StartStructure | undefined
}
export type axialCoordiantes = {
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
    attackerPlayerId: string | undefined,
    defenderPlayerId: string | undefined
}
export type challengerTokens = {
    sancturies: boolean,
    clans: boolean,
    territories: boolean
}