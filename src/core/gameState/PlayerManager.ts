import { Player } from "../Player";
import { GameState } from "./GameState"
export class PlayerManager {
    _gameState: GameState;
    players: Map<string, Player>;
    numPlayers: number;
    constructor(gameState: GameState) {
        this._gameState = gameState;
        this.players = new Map();
        this.numPlayers = 3;
    }
    AddPlayer({ userId, username }: { userId: string, username: string }): void {
        if (this.players.size < this.numPlayers) {
            const player: Player = new Player(userId);
            player.username = username;
            this.players.set(player.id, player);
        }
    }
    GetPlayerById(userId: string): Player | undefined {
        return this.players.get(userId);
    }
    GetPlayers(): Player[] {
        return Array.from(this.players.values());
    }
    GetPlayerBySocket(socketId: string): Player | undefined {
        for (const player of this.players.values()) {
            if (player.socket && player.socket.id === socketId) {
                return player;
            }
        }
        return undefined;
    }
    HasPlayer(playerId: string): boolean {
        return this.players.has(playerId);
    }
}