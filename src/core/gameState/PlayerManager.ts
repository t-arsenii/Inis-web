import { Player } from "../Player";
import { GameState } from "./GameState"

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 4;
export class PlayerManager {
    _gameState: GameState;
    players: Map<string, Player>;
    numPlayers: number;
    constructor(gameState: GameState) {
        this._gameState = gameState;
        this.players = new Map();
        this.numPlayers = 3;
    }
    SetNumberOfPlayers(numPlayers: number): void {
        if (numPlayers < MIN_PLAYERS || numPlayers > MAX_PLAYERS) {
            throw new Error("Invalid number of players");
        }
        this.numPlayers = numPlayers;
    }
    AddPlayer({ id, username, mmr }: { id: string, username: string, mmr: number }): void {
        if (this.players.size < this.numPlayers) {
            const player: Player = new Player(id);
            player.username = username;
            player.mmr = mmr;
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