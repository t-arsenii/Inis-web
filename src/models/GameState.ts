import { Player } from "./Player";
import { v4 } from "uuid";
import { HexGrid } from "./Territory";
enum GameStage {
  Gathering,
  Season,
  Fight
}
type turnOrder = {
  playersId: string[],
  order: "clockwise" | "counter-clockwise",
  activePlayerId: string;
}

export class GameState {
  Id: string = "";
  players: Map<string, Player> = new Map();
  maxPlayers: number = 3;
  turnOrder: turnOrder = {
    playersId: [],
    order: "clockwise",
    activePlayerId: ""
  }
  map: HexGrid = new HexGrid()
  gameStage: GameStage = GameStage.Gathering
  gameStatus: boolean = false

  constructor(lobbyId?: string) {
    this.Id = lobbyId || v4();
  }
  initGame(): void {
    if (this.gameStatus) {
      throw new Error("Game is already initialized");
    }
    // if (!this.checkSockets()) {
    //   throw new Error("Not all socket are connected");
    // }
    //Randomize array and picking first player id who becomes active player
    this.shuffleArray(this.turnOrder.playersId)
    const activePlayerId = this.turnOrder.playersId[0]
    //Setting active player
    this.turnOrder.activePlayerId = activePlayerId
    //Setting bren boolean in active player object
    const activePlayer: Player | undefined = this.getPlayer(activePlayerId)
    if (!activePlayer) {
      return
    }
    activePlayer.isBren = true
    this.gameStatus = true
    this.gameStage = GameStage.Gathering
    this.map.InitHexagons()
  }
  private shuffleArray(array: string[]): void {
    array.sort(() => Math.random() - 0.5);
  };
  private checkSockets(): boolean {
    const players: Player[] = Array.from(this.players.values())
    for (const player of players) {
      if (!player.Socket) {
        return false;
      }
    }
    return true
  }
  addPlayer(player: Player): void {
    if (this.players.size < this.maxPlayers) {
      this.players.set(player.Id, player);
      this.turnOrder.playersId.push(player.Id)
    }
  }
  addPlayerById(userId: string): void {
    if (this.players.size < this.maxPlayers) {
      const player: Player = new Player(userId)
      this.players.set(player.Id, player);
      this.turnOrder.playersId.push(player.Id)
    }
  }

  // deletePlayer(userId: string): void {
  //   if (this.players.size != 0) {
  //     this.players.delete(userId)
  //   }
  // }
  getPlayer(userId: string): Player | undefined {
    return this.players.get(userId)
  }
  toJSON() {
    const { Id, maxPlayers, turnOrder, gameStage, gameStatus } = this;
    const playersArray = Array.from(this.players.values()).map(p => ({ id: p.Id, socketId: p.Socket?.id }));
    return {
      Id,
      players: playersArray,
      maxPlayers,
      turnOrder,
      gameStage,
      gameStatus,
      HexGrid: this.map.toJSON()
    };
  }
}