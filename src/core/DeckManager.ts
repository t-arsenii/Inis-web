import { cardActionsMap } from "../constans/constans_cards";
import { shuffle } from "../services/helperFunctions";
import { Card } from "../types/Types"
import { Card_type } from "../types/Enums"
import { GameState } from "./GameState";
export class Deck {
    ActionCards: string[] = [];
    EposCards: string[] = [];
    AdvantagesCards: string[] = [];
    addCard(cardId: string) {
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
    //currentCards: string[]
    currentDiscard: string[] = []
    defferedCard: string = ""
    constructor(gameState: GameState) {
        this.gameState = gameState
        //this.currentCards = Array.from(cardMap.keys())
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
    playCard(playerId: string, cardId: string): void {
        if (!this.playersDeck.has(playerId)) {
            return
        }
        const deck: Deck = this.playersDeck.get(playerId)!
        if (!cardActionsMap.has(cardId)) {
            return
        }
        const playedCard: Card | undefined = cardActionsMap.get(cardId)
        if (!playedCard) {
            return
        }
        switch (playedCard.card_type) {
            case Card_type.Action:
                deck.ActionCards.filter(cardId => cardId !== playedCard.id)
                break
            case Card_type.Advantage:
                deck.AdvantagesCards.filter(cardId => cardId !== playedCard.id)
                break
            case Card_type.Epos:
                deck.EposCards.filter(cardId => cardId !== playedCard.id)
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
}