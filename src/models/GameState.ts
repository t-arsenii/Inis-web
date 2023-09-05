import { Player } from "./Player";

enum GameStage {
  Gathering,
  Season,
  Fight
}

export class GameState {
  Id: string = "";
  players: Map<string, Player> = new Map();
  activePlayerId: string = "";
  maxPlayers: number = 3;

  gameStage: GameStage = GameStage.Gathering

  gameStatus: boolean = false

  constructor(lobbyId: string) {
    this.Id = lobbyId;
  }

  addPlayer(player: Player): void {
    if (this.players.size < this.maxPlayers) {
      this.players.set(player.Id, player);
    }
  }
  deletePlayer(userId: string): void {
    if (this.players.size != 0) {
      this.players.delete(userId)
    }
  }
  getPlayer(userId: string): Player | undefined {
    return this.players.get(userId)
  }
};