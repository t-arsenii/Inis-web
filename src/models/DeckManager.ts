import { Card } from "./Card"
type Deck = {
    //Hand
    ActionCards: Card[];
    EposCards: Card[];
    AdvantagesCards: Card[];
}
class DeckManager {
    playersDeck: Map<string, Deck> = new Map()
}