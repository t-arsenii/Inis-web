import { Deck } from "../core/DeckManager";
import { GameState } from "../core/GameState";
import { HexGridToJson } from "./HexGridService";

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
        players: Array.from(gameState.players.values()).map(p => ({ id: p.id, socketId: p.socket?.id, isActive: p.isActive, clansLeft: p.clansLeft })),
        HexGrid: HexGridToJson(gameState.map),
        Decks: { playersDecks: deckArray, discard: gameState.deckManager.currentDiscard, defferedCard: gameState.deckManager.defferedCard }
    };
}