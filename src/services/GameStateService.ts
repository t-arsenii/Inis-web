import { Deck } from "../core/DeckManager";
import { GameState } from "../core/GameState";
import { Player } from "../core/Player";
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
        players: Array.from(gameState.players.values()).map(p => ({ id: p.id, socketId: p.socket?.id, isActive: p.isActive, clansLeft: p.clansLeft, ChallengerTokens: p.challengerTokens, deedTokens: p.deedTokens })),
        HexGrid: HexGridToJson(gameState.map),
        Decks: { playersDecks: deckArray, discard: gameState.deckManager.actionDiscard, defferedCard: gameState.deckManager.defferedCard }
    };
}
export function ChallengerClans(gameState: GameState, player: Player, winning_amount: number): boolean {
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
export function ChallengerSanctuaries(gameState: GameState, player: Player, winning_amount: number): boolean {
    const hexArr = gameState.map.fieldsController.GetPlayerHex(player)!
    let sanctuariesCount: number = 0
    hexArr.forEach(hex => {
        sanctuariesCount += hex.field.sanctuaryCount
    })
    return sanctuariesCount >= winning_amount
}
export function ChallengerTerritories(gameState: GameState, player: Player, winning_amount: number): boolean {
    const hexArr = gameState.map.fieldsController.GetPlayerHex(player)!
    return hexArr.length >= winning_amount
}