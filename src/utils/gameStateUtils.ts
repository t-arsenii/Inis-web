import { Deck } from "../core/DeckManager";
import { Player } from "../core/Player";
import { cardAllMap } from "../core/constans/constant_all_cards";
import { GameState } from "../core/gameState/GameState";
import { HexGridToJson } from "./HexGridUtils";

export function GameStateToJSON(gameState: GameState) {
    const { id: Id, numPlayers: maxPlayers, turnOrder, gameStage, gameStatus } = gameState;
    const { citadelsLeft, sanctuariesLeft } = gameState.map.fieldsController
    const deckArray: { id: string; deck: Deck }[] = [];
    gameState.deckManager.playersDeck.forEach((deck, playerId) => {
        deckArray.push({ id: playerId, deck: deck });
    });
    return {
        Id,
        gameInfo:
        {
            gameStatus,
            maxPlayers,
            citadelsLeft,
            sanctuariesLeft,
            gameStage: gameStage || "",
        },
        bren: Array.from(gameState.players.values()).find(p => p.isBren)?.id || "",
        turnOrder,
        players: Array.from(gameState.players.values()).map(p => ({ id: p.id, socketId: p.socket?.id, isActive: p.isActive, clansLeft: p.clansLeft, PretenderTokens: p.pretenderTokens, deedTokens: p.deedTokens })),
        Map: HexGridToJson(gameState.map),
        Decks: { playersDecks: deckArray, discard: gameState.deckManager.actionDiscard, defferedCard: gameState.deckManager.defferedCardId }
    };
}
export function GameStateToJSONFormated(gameState: GameState) {
    const { id: Id, numPlayers: maxPlayers, turnOrder, gameStage, gameStatus } = gameState;
    const { citadelsLeft, sanctuariesLeft } = gameState.map.fieldsController
    const deckArray: { id: string; deck: any }[] = [];
    gameState.deckManager.playersDeck.forEach((deck, playerId) => {
        const playerDeck = {
            ActionCards: <string[]>[],
            EposCards: <string[]>[],
            AdvantagesCards: <string[]>[],
        };

        deck.ActionCards.forEach((cardId) => {
            const card = cardAllMap.get(cardId);
            if (card) {
                playerDeck.ActionCards.push(card.title);
            }
        });

        deck.EposCards.forEach((cardId) => {
            const card = cardAllMap.get(cardId);
            if (card) {
                playerDeck.EposCards.push(card.title);
            }
        });

        deck.AdvantagesCards.forEach((cardId) => {
            const card = cardAllMap.get(cardId);
            if (card) {
                playerDeck.AdvantagesCards.push(card.title);
            }
        });

        deckArray.push({ id: playerId, deck: playerDeck });
    });
    return {
        Id,
        gameInfo:
        {
            gameStatus,
            maxPlayers,
            citadelsLeft,
            sanctuariesLeft,
            gameStage: gameStage || "",
        },
        bren: gameState.brenPlayer.id || "",
        turnOrder,
        players: Array.from(gameState.players.values()).map(p => ({ id: p.id, userName: p.username, socketId: p.socket?.id, isActive: p.isActive, clansLeft: p.clansLeft, PretenderTokens: p.pretenderTokens, deedTokens: p.deedTokens })),
        Map: HexGridToJson(gameState.map),
        Decks: { playersDecks: deckArray, discard: gameState.deckManager.actionDiscard, defferedCard: gameState.deckManager.defferedCardId }
    };
}
export function PretenderClans(gameState: GameState, player: Player, winning_amount: number): boolean {
    const hexArr = gameState.map.fieldsController.GetPlayerHex(player)!
    const leaderHex = hexArr.filter(hex => { hex.field.leaderPlayerId === player.id })
    if (leaderHex.length <= 0) {
        return false
    }
    let clansCounter = 0
    leaderHex.forEach(hex => {
        hex.field.playersClans.forEach((clansNumber, playerIdInMap) => {
            if (playerIdInMap !== player.id) {
                clansCounter += clansNumber;
            }
        });
    });
    return clansCounter >= winning_amount
}
export function PretenderSanctuaries(gameState: GameState, player: Player, winning_amount: number): boolean {
    const hexArr = gameState.map.fieldsController.GetPlayerHex(player)!
    let sanctuariesCount: number = 0
    hexArr.forEach(hex => {
        sanctuariesCount += hex.field.sanctuaryCount
    })
    return sanctuariesCount >= winning_amount
}
export function PretenderTerritories(gameState: GameState, player: Player, winning_amount: number): boolean {
    const hexArr = gameState.map.fieldsController.GetPlayerHex(player)!
    return hexArr.length >= winning_amount
}