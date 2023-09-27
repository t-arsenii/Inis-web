import { cardActionsMap } from "../constans/constans_action_cards";
import { shuffle } from "../services/helperFunctions";
import { Card } from "../types/Types"
import { Card_type } from "../types/Enums"
import { GameState } from "./GameState";
import { Player } from "./Player";
export class Deck {
    ActionCards: string[] = [];
    EposCards: string[] = [];
    AdvantagesCards: string[] = [];
    addCard(cardId: string) {
        if (!cardActionsMap.has(cardId)) {
            throw new Error("Deck.addCard: cardId not found")
        }
        const card = cardActionsMap.get(cardId)!
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
}
export class DeckManager {
    deckSize: number = 4
    gameState: GameState
    playersDeck: Map<string, Deck> = new Map()
    currentDiscard: string[] = []
    defferedCard: string = ""
    constructor(gameState: GameState) {
        this.gameState = gameState
    }
    PlayerHasCard(player: Player, cardId: string): boolean {
        const deck: Deck = this.playersDeck.get(player.id)!
        const allCards: string[] = [...deck.ActionCards, ...deck.AdvantagesCards, ...deck.EposCards]
        return allCards.includes(cardId)
    }
    addPlayer(id: string): void {
        if (this.playersDeck.size < this.gameState.numPlayers) {
            this.playersDeck.set(id, new Deck())
        }
    }
    addPlayers(playersId: string[]) {
        if (playersId.length <= this.gameState.numPlayers - this.playersDeck.size) {
            playersId.forEach(id => this.addPlayer(id))
        }
    }
    playCard(player: Player, cardId: string): void {
        const deck: Deck = this.playersDeck.get(player.id)!
        if (!cardActionsMap.has(cardId)) {
            throw new Error("DeckManager.playCard: cardId not found")
        }
        const playedCard: Card = cardActionsMap.get(cardId)!
        switch (playedCard.card_type) {
            case Card_type.Action:
                deck.ActionCards = deck.ActionCards.filter(cardId => cardId !== playedCard.id)
                break
            case Card_type.Advantage:
                deck.AdvantagesCards = deck.AdvantagesCards.filter(cardId => cardId !== playedCard.id)
                break
            case Card_type.Epos:
                deck.EposCards = deck.EposCards.filter(cardId => cardId !== playedCard.id)
                break
        }
        this.currentDiscard.push(playedCard.id)

    }
    DealCards() {
        const Cards = shuffle(Array.from(cardActionsMap.keys()))
        this.playersDeck.forEach((deck, playerId) => {
            for (let i = 0; i < this.deckSize; i++) {
                deck.addCard(Cards.pop()!);
            }
        })
        this.defferedCard = Cards.pop()!
    }
    addCard(player: Player, cardId: string) {
        const deck: Deck = this.playersDeck.get(player.id)!
        if (!cardActionsMap.has(cardId)) {
            throw new Error("DeckManager.addCard: cardId not found")
        }
        const card: Card = cardActionsMap.get(cardId)!
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
}