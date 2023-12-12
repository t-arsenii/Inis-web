
import { Player } from "../core/Player"
import { GameState } from "../core/gameState/GameState"
import { Field } from "../core/map/Field"
import { ActionType, AttackerAction, PretenderTokenType, DeffenderAction, playerAction, GameStage } from "./Enums"
import { axialCoordinates } from "./Types"

export interface ICardParams {
    axial?: axialCoordinates[],
    singleAxial?: axialCoordinates,
    targetPlayerId?: string,
    axialToNum?: { axial: axialCoordinates, num: number }[],
    targetCardId?: string,
    cardVariation?: number,
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
    axial?: axialCoordinates[],
    cardIds?: string[],
    maxTerClicks?: number,
    maxCardClicks?: number,
    maxTargetPlayerClicks?: number
    axialToNum?: { axial: axialCoordinates, num: number }[],
    axialToPlayerId?: { axialCoordinates: axialCoordinates, playerIds: string[] }[]
}
export interface IAttackerInputParams {
    attackerAction: AttackerAction,
    axial?: axialCoordinates,
    targetPlayerId?: string,
    clansNum?: number
}
export interface IAttackerParams {
    player: Player,
    attackerAction: AttackerAction
    axial?: axialCoordinates,
    targetPlayerId?: string,
    clansNum?: number
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
        id: string,
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
    gameStage: GameStage
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
export interface IAttackCycleUiInfo {
    status: boolean,
    attackerPlayerId: string | null,
    defenderPlayerId: string | null
}
export interface IPlayer {
    id: string
    username: string,
    mmr: number,
    color?: string,
}
export interface IPlayerDto {
    id: string
    username: string,
    mmr: number,
    color?: string,
}
export interface ICreateGameDto {
    players: IPlayerDto[],
    settings: IGameStatsInput
}
export interface IPlayersUiInfo {
    players: {
        id: string
        username: string,
        mmr: number,
        color?: string
    }[]
}
export interface IMeUiInfo {
    id: string
    username: string,
    mmr: number,
    color?: string
}
export interface IPretenderToken {
    sanctuaries: boolean,
    clans: boolean,
    territories: boolean
}
export interface IGameStats {
    numberOfPlayers: number,
    gameSpeed: string,
    ranked: boolean,
    winner: string | null,
    roundCounter: number
}
export interface IGameStatsInput {
    numberOfPlayers: number,
    gameSpeed: string,
    ranked: boolean
}
export interface IGameDataOutput {
    duration: number,
    rounds: number,
    numberOfPlayers: number,
    players: string[],
    gameSpeed: string,
    ranked: boolean,
    winner: string
}