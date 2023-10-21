import { playerInfo } from "../../types/Types";
import { Player } from "../Player";
import { GameState } from "./GameState";

class GameStateManager {
    private gameStates: Map<string, GameState> = new Map();
    socketsConnInfo: Map<string, playerInfo> = new Map();
    createGame(gameState: GameState): void {
        this.gameStates.set(gameState.id, gameState);
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
    getSocketInfo(socketId: string): playerInfo | undefined {
        return this.socketsConnInfo.get(socketId)
    }
    addSocketInfo(socketId: string, player: Player, gameState: GameState): void {
        this.socketsConnInfo.set(socketId, { gameState: gameState, player: player });
    }
    removeSocketInfo(socketId: string): void {
        this.socketsConnInfo.delete(socketId);
    }
}

export const gamesManager: GameStateManager = new GameStateManager();