import { GameState } from "./gameState/GameState";
import redis, { RedisClientType } from "redis";
export class RedisConverter {
    _redisClient: RedisClientType;
    constructor(redisClient: RedisClientType) {
        this._redisClient = redisClient;
    }
    private serializeGame(gameState: GameState): string {
        let _deckManager = gameState.deckManager;
        return JSON.stringify({
            gameState: {
                id: gameState.id,
                gameStatus: gameState.gameStatus,
                gameStage: gameState.gameStage,
                deedTokensLeft: gameState.deedTokensLeft,
                pretenderTokensLeft: gameState.pretenderTokensLeft,
                brenPlayer: gameState.brenPlayer,
                roundCounter: gameState.roundCounter
            },
            deckManager: {
                actionCardsDeckSize: _deckManager.actionCardsDeckSize,
                playersDeck: Object.fromEntries(_deckManager.playersDeck.entries()),
                eposCards: _deckManager.eposCards,
                eposDiscard: _deckManager.eposDiscard,
                actionDiscard: _deckManager.actionDiscard,
                defferedCardId: _deckManager.defferedCardId,
                dealCards: _deckManager.dealCards,
            }
        })
    }
    private desirializeGame(gameState: GameState) {

    }
    saveGameStateToRedis(gameState: GameState) {
        this._redisClient.set(`game:${gameState.id}`, this.serializeGame(gameState));
    }
    getGameStateFromRedis(gameId: string) {
        console.log(this._redisClient.get(`game:${gameId}`));
    }
}