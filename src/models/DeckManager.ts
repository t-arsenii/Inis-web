import { cardMap } from "../GameLogic/Constans/constans_cards";
import { Card, Card_type } from "./Card"
import { GameState } from "./GameState";
class Deck {
    //Hand
    ActionCards: string[] = [];
    EposCards: string[] = [];
    AdvantagesCards: string[] = [];
}
export class DeckManager {
    gameState: GameState
    playersDeck: Map<string, Deck> = new Map()
    currentCards: string[]
    currentDiscard: string[] = []
    constructor(gameState: GameState) {
        this.gameState = gameState
        this.currentCards = Array.from(cardMap.keys())
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
        if (!cardMap.has(cardId)) {
            return
        }
        const playedCard: Card | undefined = cardMap.get(cardId)
        if (!playedCard) {
            return
        }
        switch (playedCard.card_type) {
            case Card_type.Action:
                deck.ActionCards.filter(cardId => cardId !== playedCard.id)
            case Card_type.Advantage:
                deck.AdvantagesCards.filter(cardId => cardId !== playedCard.id)
            case Card_type.Epos:
                deck.EposCards.filter(cardId => cardId !== playedCard.id)
        }
        this.currentDiscard.push(playedCard.id)

    }
}