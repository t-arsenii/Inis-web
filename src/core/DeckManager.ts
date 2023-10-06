import { cardActionMap } from "./constans/constant_action_cards";
import { shuffle } from "../services/helperFunctions";
import { Card } from "../types/Types"
import { Card_type } from "../types/Enums"
import { GameState } from "./GameState";
import { Player } from "./Player";
import { cardEposMap } from "./constans/constant_epos_cards";
export class Deck {
    ActionCards: string[] = [];
    EposCards: string[] = [];
    AdvantagesCards: string[] = [];
    addCard(cardId: string) {
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
}
export class DeckManager {
    deckSize: number = 4
    gameState: GameState
    playersDeck: Map<string, Deck> = new Map()
    eposCards: string[] = []
    eposDiscard: string[] = []
    actionDiscard: string[] = []
    defferedCard: string = ""
    constructor(gameState: GameState) {
        this.gameState = gameState
    }
    PlayerHasCard(player: Player, cardId: string): boolean {
        const deck: Deck = this.playersDeck.get(player.id)!
        const allCards: string[] = [...deck.ActionCards, ...deck.AdvantagesCards, ...deck.EposCards]
        return allCards.includes(cardId)
    }
    Init() {
        this.gameState.players.forEach((player, pId) => {
            this.playersDeck.set(pId, new Deck())
        })
        const eposCards = shuffle(Array.from(cardEposMap.keys()))
    }
    AddRandomEposCard(player: Player) {
        if (this.eposCards.length <= 0) {
            throw new Error("DeckManager.AddRandomEpos: no epos cards left")
        }
        const eposCardId = this.eposCards.pop()!
        this.playersDeck.get(player.id)?.addCard(eposCardId)
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
    DealCards() {
        const Cards = shuffle(Array.from(cardActionMap.keys()))
        this.playersDeck.forEach((deck, playerId) => {
            for (let i = 0; i < this.deckSize; i++) {
                deck.addCard(Cards.pop()!);
            }
        })
        this.defferedCard = Cards.pop()!
    }
    AddCard(player: Player, cardId: string) {
        const deck: Deck = this.playersDeck.get(player.id)!
        if (!cardActionMap.has(cardId)) {
            throw new Error("DeckManager.addCard: cardId not found")
        }
        const card: Card = cardActionMap.get(cardId)!
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