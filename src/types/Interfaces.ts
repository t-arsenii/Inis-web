
import { Player } from "../core/Player"
import { GameState } from "../core/gameState/GameState"
import { Field } from "../core/map/HexagonField"
import { ActionType, AttackerAction, PretenderTokenType, DeffenderAction, playerAction } from "./Enums"
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

export interface ISidebarUiInfo {
    players: {
        username: string,
        mmr: number,
        deck: {
            Epos: number,
            Action: number,
            Advantage: number
        },
        clans: number,
        tokens: {
            deed: number,
            pretender: number
        },
        isBren: boolean,
        isActive: boolean,
        lastAction: playerAction
    }[],
    turnDirection: string
}
export interface IMyDeckUiInfo {
    ActionCards: string[],
    EposCards: string[],
    AdvantagesCards: string[]
}
export interface IMapUiInfo {
    capital: axialCoordinates | null;
    holiday: axialCoordinates | null;
    hexGrid: {
        q: number;
        r: number;
        field: Field;
    }[];
    terLeft: number;
}
export interface IGameUiInfo {
    gameStatus: boolean,
    maxPlayers: number,
    citadelsLeft: number,
    sanctuariesLeft: number,
    gameStage: string
}
export interface IDealCardsInfo {
    cardsToDiscardNum: number,
    cardIds: string[]
}
export interface IFightUiInfo {
    fightHex: axialCoordinates,
    players:
    {
        playerId: string,
        clansNum: number,
        peace: boolean,
        isActive: boolean
    }[]
}