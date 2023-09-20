import { GameState } from "../core/GameState"
import { Player } from "../core/Player"
import { axialCoordiantes } from "./Types"

export interface ICardParams {
    axial?: axialCoordiantes | axialCoordiantes[],
    targetPlayerId?: string,
    axialToNum?: { axial: axialCoordiantes, num: number }[] | { axial: axialCoordiantes, num: number }
    targetCardId?:string
}
export interface IPlayerCardInput {
    cardId: string,
    params?: ICardParams
}
export interface ICardOperationParams extends ICardParams {
    gameState: GameState,
    player: Player
}

export interface ICardOperationResponse{
    axial:axialCoordiantes | axialCoordiantes[],
    cardId: string | string[],
    num:number
}