import { GameState } from "./GameState";

class GameStateManager {
    private gameStates: Map<string, GameState> = new Map();

    createGame(gameState: GameState): void {
        this.gameStates.set(gameState.Id, gameState);
    }
    deleteGame(id: string): void {
        this.gameStates.delete(id)
    }
    getGame(id: string): GameState | undefined {
        return this.gameStates.get(id)
    }
    getGameStates(): Array<GameState> {
        return Array.from(this.gameStates.values());
    }
}

export const gamesManager: GameStateManager = new GameStateManager()