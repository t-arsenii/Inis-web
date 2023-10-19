
import { Player } from "../core/Player"
import { GameState } from "../core/gameState/GameState"
import { ActionType, AttackerAction, PretenderTokenType, DeffenderAction } from "./Enums"
import { axialCoordinates } from "./Types"

export interface ICardParams {
    axial?: axialCoordinates | axialCoordinates[]
    targetPlayerId?: string,
    axialToNum?: { axial: axialCoordinates, num: number }[] | { axial: axialCoordinates, num: number }
    targetCardId?: string,
    CardVariation?: number
}
export interface IPlayerCardInput {
    cardId: string,
    params?: ICardParams
}
export interface ICardOperationParams extends ICardParams {
    gameState: GameState,
    player: Player
}
export interface ICardOperationResponse {
    axial?: axialCoordinates | axialCoordinates[],
    cardId?: string | string[],
    num?: number,
    axialToNum?: { axial: axialCoordinates, num: number }[] | { axial: axialCoordinates, num: number }
}
export interface IAttackerInputParams {
    attackerAction: AttackerAction,
    axial?: axialCoordinates,
    targetPlayerId?: string
}
export interface IAttackerParams {
    player: Player,
    attackerAction: AttackerAction
    axial?: axialCoordinates,
    targetPlayerId?: string
}
export interface IDeffenderInputParams {
    deffenderAction: DeffenderAction,
    cardId?: string
}
export interface IPretenderTokenInput {
    type: PretenderTokenType
}
export interface IPlayerCardDealInput {
    cardIds: string[]
}