import { Deck } from "../core/DeckManager";
import { Player } from "../core/Player";
import { MIN_WINNING_AMOUNT } from "../core/constans/constant_3_players";
import { cardAllMap } from "../core/constans/constant_all_cards";
import { GameState } from "../core/gameState/GameState";
import { Hexagon } from "../core/map/HexagonField";
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

export function updateBren(gameState: GameState): void {
    const capitalHex: Hexagon | null = gameState.map.fieldsController.capitalHex;
    if (!capitalHex) {
        throw new Error("Capital hex not found");
    }
    if (capitalHex.field.leaderPlayerId === null) {
        return;
    }
    if (capitalHex.field.leaderPlayerId !== gameState.brenPlayer.id) {
        const newBrenplayer: Player = gameState.GetPlayerById(capitalHex.field.leaderPlayerId)!;
        gameState.brenPlayer.isBren = false;
        //setting new bren
        gameState.brenPlayer = newBrenplayer;
        newBrenplayer.isBren = true;
    }
}

export function updatePretenderTokens(gameState: GameState): void {
    const players: Player[] = Array.from(gameState.players.values())
    players.forEach(player => {
        const winning_amount = MIN_WINNING_AMOUNT - player.deedTokens
        if (player.pretenderTokens.clans) {
            player.pretenderTokens.clans = PretenderClans(gameState, player, winning_amount);
        }
        if (player.pretenderTokens.sanctuaries) {
            player.pretenderTokens.sanctuaries = PretenderSanctuaries(gameState, player, winning_amount);
        }
        if (player.pretenderTokens.territories) {
            player.pretenderTokens.sanctuaries = PretenderTerritories(gameState, player, winning_amount);
        }
    })
}

export function tryGetWinnerPlayer(gameState: GameState): Player | null {
    let maxTokens = -Infinity;
    let playersWithMaxTokens: Player[] = [];
    const players: Player[] = Array.from(gameState.players.values());
    for (const player of players) {
        const { pretenderTokens: pretenderTokens, isBren } = player;
        const { sanctuaries, clans, territories } = pretenderTokens;
        const tokensCount = [sanctuaries, clans, territories].filter(token => token === true).length;
        if (tokensCount > 0 && tokensCount > maxTokens) {
            maxTokens = tokensCount;
            playersWithMaxTokens = [player];
        } else if (tokensCount === maxTokens) {
            playersWithMaxTokens.push(player);
        }
    }
    if (playersWithMaxTokens.length === 1) {
        return playersWithMaxTokens[0];
    }
    const brenPlayer = playersWithMaxTokens.find(player => player.isBren === true);
    if (brenPlayer) {
        return brenPlayer;
    } else {
        return null;
    }
}