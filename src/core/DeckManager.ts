import { cardActionMap } from "./constans/constant_action_cards";
import { shuffle } from "../utils/helperFunctions";
import { Card, DealCards } from "../types/Types"
import { Card_type } from "../types/Enums"
import { GameState } from "./gameState/GameState";
import { Player } from "./Player";
import { cardEposMap } from "./constans/constant_epos_cards";
import { territoryMap } from "./constans/constant_territories";
import { cardAdvantageMap } from "./constans/constant_advantage_cards";
import { cardAllMap } from "./constans/constant_all_cards";
export class Deck {
    ActionCards: string[] = [];
    EposCards: string[] = [];
    AdvantagesCards: string[] = [];
    AddCard(cardId: string) {
        if (!cardActionMap.has(cardId)) {
            throw new Error("Deck.addCard: cardId not found")
        }
        const card = cardActionMap.get(cardId)!
        switch (card.card_type) {
            case Card_type.Action:
                this.ActionCards.push(card.id)
                break
            case Card_type.Advantage:
                this.EposCards.push(card.id)
                break
            case Card_type.Epos:
                this.AdvantagesCards.push(card.id)
                break
        }
    }

    ClearActionCards() {
        this.ActionCards = [];
    }
    ClearEposCards() {
        this.EposCards = [];
    }
    ClearAdvantagesCards() {
        this.AdvantagesCards = [];
    }
}
export class DeckManager {
    readonly deckSize: number = 4;
    playersDeck: Map<string, Deck> = new Map();
    eposCards: string[] = [];
    eposDiscard: string[] = [];
    actionDiscard: string[] = [];
    defferedCardId: string = "";
    //Dealing cards logic
    dealCards: DealCards | null = null
    //DI
    _gameState: GameState;
    constructor(gameState: GameState) {
        this._gameState = gameState
    }
    getPlayerDeck(player: Player): Deck | undefined {
        return this.playersDeck.get(player.id);
    }
    PlayerHasCard(player: Player, cardId: string): boolean {
        const deck: Deck = this.playersDeck.get(player.id)!
        const allCards: string[] = [...deck.ActionCards, ...deck.AdvantagesCards, ...deck.EposCards]
        return allCards.includes(cardId)
    }
    Init() {
        const players = this._gameState.playerManager.GetPlayers();
        players.forEach((player) => {
            this.playersDeck.set(player.id, new Deck())
        })
        const eposCards = shuffle(Array.from(cardEposMap.keys()))
    }
    AddRandomEposCard(player: Player) {
        if (this.eposCards.length <= 0) {
            throw new Error("DeckManager.AddRandomEpos: no epos cards left")
        }
        const eposCardId = this.eposCards.pop()!
        this.playersDeck.get(player.id)?.AddCard(eposCardId)
    }
    DiscardCard(player: Player, cardId: string): void {
        const deck: Deck = this.playersDeck.get(player.id)!
        if (!cardActionMap.has(cardId)) {
            throw new Error("DeckManager.PlayCard: cardId not found")
        }
        const playedCard: Card = cardActionMap.get(cardId)!
        switch (playedCard.card_type) {
            case Card_type.Action:
                deck.ActionCards = deck.ActionCards.filter(cardId => cardId !== playedCard.id)
                this.actionDiscard.push(playedCard.id)
                break
            case Card_type.Advantage:
                deck.AdvantagesCards = deck.AdvantagesCards.filter(cardId => cardId !== playedCard.id)
                break
            case Card_type.Epos:
                deck.EposCards = deck.EposCards.filter(cardId => cardId !== playedCard.id)
                this.eposDiscard.push(playedCard.id)
                break
        }
    }
    AddCard(player: Player, cardId: string) {
        const deck: Deck = this.playersDeck.get(player.id)!
        const card: Card | undefined = cardAllMap.get(cardId)
        if (!card) {
            throw new Error("DeckManager.addCard: cardId not found")
        }
        switch (card.card_type) {
            case Card_type.Action:
                deck.ActionCards.push(card.id)
                break
            case Card_type.Advantage:
                deck.AdvantagesCards.push(card.id)
                break
            case Card_type.Epos:
                deck.EposCards.push(card.id)
                break
        }
    }
    private ClearActionCardsDeck() {
        this.playersDeck.forEach((deck) => {
            deck.ClearActionCards();
        })
    }
    PlayerDealActionCardDiscard(player: Player, cardIds: string[]) {
        if (!this.dealCards) {
            throw new Error("DeckManager.PlayerDealActionCardDiscard: dealCards not initialized")
        }
        if (cardIds.length !== this.dealCards.cardsToDiscardNum) {
            throw new Error("DeckManager.PlayerDealActionCardDiscard: cardIds length not equal to cardsToDiscardNum");
        }
        const playerCards: string[] = this.dealCards.players[player.id].cards;
        for (const cardId of cardIds) {
            if (!cardActionMap.has(cardId) || !playerCards.includes(cardId)) {
                throw new Error("DeckManager.PlayerDealActionCardDiscard: cardId not found")
            }
        }
        this.dealCards.players[player.id].cardsToDiscard = cardIds;
        this.dealCards.players[player.id].cards = this.dealCards.players[player.id].cards.filter(cardId => !cardIds.includes(cardId));
        this.dealCards.players[player.id].readyToDeal = true;
    }
    public InitDealActionCards() {
        this.ClearActionCardsDeck(); // Clearing remaining action cards from player decks
        const playersInOrder: string[] = this._gameState.turnOrderManager.turnOrder.playersId;
        this.dealCards = { cardsToDiscardNum: 3, players: {} };
        const Cards = shuffle(Array.from(cardActionMap.keys()))
        playersInOrder.forEach((playerId) => {
            this.dealCards!.players[playerId] = {
                cards: [],
                cardsToDiscard: [],
                readyToDeal: false,
            };
            for (let i = 0; i < this.deckSize; i++) {
                this.dealCards!.players[playerId].cards.push(Cards.pop()!)
            }
        })
        this.defferedCardId = Cards.pop()!;
    }
    AllPlayersReadyToDeal(): boolean {
        if (!this.dealCards) {
            throw new Error("DeckManager.CanDealActionCards: dealCards not initialized")
        }
        return Object.values(this.dealCards.players).every(player => player.readyToDeal);
    }
    DealActionCards() {
        if (!this.dealCards) {
            throw new Error("DeckManager.TryDealActionCards: dealCards not initialized");
        }
        const playersDealCardsArray = Object.values(this.dealCards.players);
        let nextIndex;
        for (let i = 0; i < playersDealCardsArray.length; i++) {
            const playerFrom = playersDealCardsArray[i];
            nextIndex = (i + 1) % playersDealCardsArray.length;
            const playerTo = playersDealCardsArray[nextIndex];
            playerTo.cards.push(...playerFrom.cardsToDiscard);
            playerFrom.cardsToDiscard = [];
            playerFrom.readyToDeal = false;
        }
        this.dealCards.cardsToDiscardNum--;
    }
    CanEndDealActionCards(): boolean {
        if (!this.dealCards) {
            throw new Error("DeckManager.CanEndDealActionCards: dealCards not initialized");
        }
        return this.dealCards.cardsToDiscardNum === 0;
    }
    EndDealActionCards() {
        if (!this.dealCards) {
            throw new Error("DeckManager.TryEndDealActionCards: dealCards not initialized");
        }
        let playerDealCards: string[];
        let deck: Deck = undefined!;
        for (const playerId in this.dealCards.players) {
            if (this.dealCards.players.hasOwnProperty(playerId)) {
                playerDealCards = this.dealCards.players[playerId].cards;
                deck = this.playersDeck.get(playerId)!;
                deck.ActionCards = playerDealCards;
            }
        }
        this.dealCards = null;
    }
    DealAdvantageCards() {
        const grid = this._gameState.map.grid;
        grid.forEach(hex => {
            if (hex.field.leaderPlayerId) {
                const leaderPlayer = this._gameState.playerManager.GetPlayerById(hex.field.leaderPlayerId)!
                const advantageCardId = territoryMap.get(hex.field.territoryId)!.cardId;
                this.AddCard(leaderPlayer, advantageCardId)
            }
        })
    }
}