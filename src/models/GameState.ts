import { Player } from "./Player";
import { v4 } from "uuid";
import { HexGrid } from "./Territory";
import { DeckManager } from "./DeckManager";
enum GameStage {
  Begginig,
  Gathering,
  Season,
  Fight
}
enum TurnOrder {
  clockwise,
  counter_clockwise
}
type turnOrder = {
  playersId: string[],
  order: TurnOrder,
  activePlayerId: string;
}

export class GameState {
  id: string = "";
  players: Map<string, Player> = new Map();
  numPlayers: number = 3;
  turnOrder: turnOrder = {
    playersId: [],
    order: TurnOrder.clockwise,
    activePlayerId: ""
  }
  deckManager: DeckManager = new DeckManager(this)
  map: HexGrid = new HexGrid()
  gameStage: GameStage = GameStage.Begginig
  gameStatus: boolean = false

  constructor(lobbyId?: string) {
    this.id = lobbyId || v4();
  }
  initGame(): void {
    //Checking if game is already initialized
    if (this.gameStatus) {
      throw new Error("Game is already initialized");
    }

    //Checking for all players connection
    // if (checkSockets(this.players)) {
    //   throw new Error("Not all socket are connected");
    // }

    //Picking and setting active player and turn order
    shuffleArray(this.turnOrder.playersId)
    const activePlayerId = this.turnOrder.playersId[0]
    this.turnOrder.activePlayerId = activePlayerId
    this.players.get(activePlayerId)!.isActive = true
    this.turnOrder.order = getRandomOrder()

    //Setting bren boolean in active player object
    const activePlayer: Player | undefined = this.getPlayer(activePlayerId)
    if (!activePlayer) {
      return
    }
    activePlayer.isBren = true

    //Setting game status and stage 
    this.gameStatus = true
    this.gameStage = GameStage.Begginig

    //Initializing map
    this.map.InitHexagons()

    //Initializing players decks
    this.deckManager.addPlayers(Array.from(this.players.keys()))
  }
  nextTurn(): void {
    const activePlayerId = this.turnOrder.activePlayerId
    this.players.get(activePlayerId)!.isActive = false
    const activePlayerIndex = this.turnOrder.playersId.indexOf(activePlayerId)
    let nextIndex
    if (this.turnOrder.order === TurnOrder.clockwise) {
      nextIndex = (activePlayerIndex + 1) % this.numPlayers;
    }
    else {
      nextIndex = (activePlayerIndex - 1 + this.numPlayers) % this.numPlayers;
    }
    const newActivePlayerId = this.turnOrder.playersId[nextIndex]
    this.turnOrder.activePlayerId = newActivePlayerId
    this.players.get(activePlayerId)!.isActive = true
  }

  addPlayer(player: Player): void {
    if (this.players.size < this.numPlayers) {
      this.players.set(player.Id, player);
      this.turnOrder.playersId.push(player.Id)
    }
  }
  addPlayerById(userId: string): void {
    if (this.players.size < this.numPlayers) {
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
    const { id: Id, numPlayers: maxPlayers, turnOrder, gameStage, gameStatus } = this;
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


function checkSockets(playersMap: Map<string, Player>): boolean {
  const players: Player[] = Array.from(playersMap.values())
  for (const player of players) {
    if (!player.Socket) {
      return false;
    }
  }
  return true
}

function shuffleArray(array: string[]): void {
  array.sort(() => Math.random() - 0.5);
}

function getRandomOrder(): TurnOrder {
  const randomValue = Math.random();
  if (randomValue < 0.5) {
    return TurnOrder.clockwise;
  } else {
    return TurnOrder.counter_clockwise;
  }
}