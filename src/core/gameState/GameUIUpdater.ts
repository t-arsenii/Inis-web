import { IAttackCycleUiInfo, IDealCardsInfo, IFightUiInfo, IGameUiInfo, IMapUiInfo, IMyDeckUiInfo, ISidebarUiInfo } from "../../types/Interfaces";
import { axialCoordinates } from "../../types/Types";
import { hexToAxialCoordinates } from "../../utils/helperFunctions";
import { Player } from "../Player";
import { territoryMap } from "../constans/constant_territories";
import { GameState } from "./GameState";

export class GameUiUpdater {
    _gameState: GameState;
    constructor(gameState: GameState) {
        this._gameState = gameState;
    }
    public getMapUiInfo(): IMapUiInfo {
        const hexGrid = this._gameState.map;
        let capitalCoordinates: axialCoordinates | null = null
        if (hexGrid.fieldsController.capitalHex) {
            capitalCoordinates = hexToAxialCoordinates(hexGrid.fieldsController.capitalHex);
        }
        let holidayCoordinates: axialCoordinates | null = null
        if (hexGrid.fieldsController.festivalHex) {
            holidayCoordinates = hexToAxialCoordinates(hexGrid.fieldsController.festivalHex);
        }
        const terLeft = hexGrid.fieldsController.avalibleTerritories.length;
        return {
            capital: capitalCoordinates,
            holiday: holidayCoordinates,
            hexGrid: Array.from(hexGrid.grid.values()).map(hex => ({ q: hex.q, r: hex.r, field: hex.field })),
            terLeft: terLeft
        };
    }
    public getMyDeckUiInfo(player: Player): IMyDeckUiInfo {
        const deck = this._gameState.deckManager.getPlayerDeck(player);
        if (!deck) {
            return {
                ActionCards: [],
                EposCards: [],
                AdvantagesCards: []
            };
        }
        return {
            ActionCards: deck.ActionCards,
            EposCards: deck.EposCards,
            AdvantagesCards: deck.AdvantagesCards
        };
    }
    public getSidebarUiInfo(): ISidebarUiInfo {
        const players = this._gameState.playerManager.GetPlayers();
        const sidebarUiInfo: ISidebarUiInfo = { players: [], turnDirection: this._gameState.turnOrderManager.GetDirection() };
        players.forEach(player => {
            const deck = this._gameState.deckManager.getPlayerDeck(player)!;
            const pretenderTokens = Object.values(player.pretenderTokens).filter(value => value === true).length;
            sidebarUiInfo.players.push({
                username: player.username,
                mmr: player.mmr,
                deck: {
                    Epos: deck.EposCards.length,
                    Action: deck.ActionCards.length,
                    Advantage: deck.AdvantagesCards.length
                },
                clans: player.clansLeft,
                tokens: {
                    deed: player.deedTokens,
                    pretender: pretenderTokens
                },
                isBren: player.isBren,
                isActive: player.isActive,
                lastAction: player.lastAction
            })
        });
        return sidebarUiInfo;
    }
    public getGameUiInfo(): IGameUiInfo {
        return {
            gameStatus: this._gameState.gameStatus,
            maxPlayers: this._gameState.playerManager.numPlayers,
            citadelsLeft: this._gameState.map.fieldsController.citadelsLeft,
            sanctuariesLeft: this._gameState.map.fieldsController.sanctuariesLeft,
            gameStage: this._gameState.gameStage
        }
    }
    public getDealCardUiInfo(player: Player): IDealCardsInfo {
        if (!this._gameState.deckManager.dealCards) {
            throw new Error("No cards to discard");
        }
        const dealCards = { ...this._gameState.deckManager.dealCards };
        if (!dealCards.players || !dealCards.players.hasOwnProperty(player.id)) {
            throw new Error("Player not found in deal cards");
        }
        const cardIds = dealCards.players[player.id].cards;
        return {
            cardsToDiscardNum: dealCards.cardsToDiscardNum,
            cardIds: cardIds
        }
    }
    public getFightUiInfo(): IFightUiInfo {
        if (!this._gameState.fightManager.currentFight) {
            throw new Error("No active fight");
        }
        const players = this._gameState.fightManager.currentFight.players;
        const activePlayerId = this._gameState.fightManager.currentFight.FightTurnOrder.activePlayerId;
        const _players = Object.keys(players).map((playerId) => ({
            playerId,
            clansNum: players[playerId].clansNum,
            peace: players[playerId].peace,
            isActive: playerId === activePlayerId
        }));
        const axialHexFight = hexToAxialCoordinates(this._gameState.fightManager.currentFight.fightHex);
        return {
            fightHex: axialHexFight,
            players: _players
        }
    }
    public getAttackCycleUiInfo(): IAttackCycleUiInfo {
        if (!this._gameState.fightManager.currentFight) {
            throw new Error("No active fight");
        }
        const currentFight = this._gameState.fightManager.currentFight;
        if (!currentFight.attackCycle) {
            return {
                status: false,
                attackerPlayerId: null,
                defenderPlayerId: null
            }
        }
        return currentFight.attackCycle;
    }
}