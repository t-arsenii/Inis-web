import { ISidebarUiInfo } from "../../types/Interfaces";
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
    public getMapUiInfo() {
        const hexGrid = this._gameState.map;
        let capitalCoordinates: axialCoordinates | null = null
        if (hexGrid.fieldsController.capitalHex) {
            capitalCoordinates = hexToAxialCoordinates(hexGrid.fieldsController.capitalHex);
        }
        let holidayCoordinates: axialCoordinates | null = null
        if (hexGrid.fieldsController.festivalHex) {
            holidayCoordinates = hexToAxialCoordinates(hexGrid.fieldsController.festivalHex);
        }
        const avalibleTerArray = hexGrid.fieldsController.avalibleTerritories.map(id => territoryMap.get(id)!.title);
        return { capital: capitalCoordinates, holiday: holidayCoordinates, hexGrid: Array.from(hexGrid.grid.values()).map(hex => ({ q: hex.q, r: hex.r, field: hex.field })), avalibleTer: avalibleTerArray };
    }
    public getMyDeckUiInfo(player: Player) {
        const deck = this._gameState.deckManager.getPlayerDeck(player);
        if (!deck) {
            return {};
        }
        return {
            ActionCards: deck.ActionCards,
            EposCards: deck.EposCards,
            AdvantagesCards: deck.AdvantagesCards
        };
    }
    public getSidebarUiInfo() {
        const players = this._gameState.playerManager.GetPlayers();
        const sidebarUiInfo: ISidebarUiInfo = { Players: [] };
        players.forEach(player => {
            const deck = this._gameState.deckManager.getPlayerDeck(player)!;
            const pretenderTokens = Object.values(player.pretenderTokens).filter(value => value === true).length;
            sidebarUiInfo.Players.push({
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
                isBren: player.isBren
            })
        });
    }
}