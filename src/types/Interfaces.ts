import { GameState } from "../core/GameState"
import { Player } from "../core/Player"
import { axialCoordiantes } from "./Types"

export interface ICardParams {
    axial?: axialCoordiantes,
    targetPlayerId?: string,
    axialArray?: axialCoordiantes[]
}

export interface IPlayerCardInput {
    cardId: string,
    params?: ICardParams
}

export interface ICardOperationParams extends ICardParams {
    gameState: GameState,
    player: Player
}