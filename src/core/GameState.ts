import { Player } from "./Player";
import { v4 } from "uuid";
import { HexGrid } from "./HexGrid";
import { Deck, DeckManager } from "./DeckManager";
import { GetRandomDirection, shuffle } from "../services/helperFunctions";
import { MAX_CHALLENGER_TOKENS, MAX_CITADELS, MAX_DEED_TOKENS, MAX_SANCTUARIES } from "../constans/constant_3_players";
import { TurnOrder, GameStage } from "../types/Enums";
import { PlayerTurnOrder } from "../types/Types";
import { HexGridToJson, InitHexGrid } from "../services/HexGridService";
import { FightManager } from "./Fighter";
import { TrixelManager } from "./TrixelManager";
import EventEmitter from "events";

export class GameState {
  id: string = "";
  players: Map<string, Player> = new Map();
  numPlayers: number = 3;
  turnOrder: PlayerTurnOrder = {
    playersId: [],
    direction: undefined!,
    activePlayerId: ""
  }
  gameStage: GameStage = undefined!
  gameStatus: boolean = false
  roundCounter: number = 0
  deedTokens: number = MAX_DEED_TOKENS
  challengerTokens: number = MAX_CHALLENGER_TOKENS
  deckManager: DeckManager = new DeckManager(this)
  fightManager: FightManager = new FightManager(this)
  trixelManager: TrixelManager = new TrixelManager(this)
  map: HexGrid = new HexGrid(this)
  eventEmitter: EventEmitter = new EventEmitter()
  constructor(lobbyId?: string) {
    this.id = lobbyId || v4();
  }
  InitGame(): void {
    //Checking if game is already initialized
    if (this.gameStatus) {
      throw new Error("Game is already initialized");
    }

    //Checking for all players connection
    // if (checkSockets(this.players)) {
    //   throw new Error("Not all socket are connected");
    // }


    //Picking and setting active player and turn order
    // this.turnOrder.playersId = shuffle(this.turnOrder.playersId)
    const activePlayerId = this.turnOrder.playersId[0]
    this.turnOrder.activePlayerId = activePlayerId
    //Setting bren boolean in active player object
    const activePlayer: Player | undefined = this.GetPlayerById(activePlayerId)
    if (!activePlayer) {
      return
    }
    activePlayer.isActive = true
    activePlayer.isBren = true
    this.turnOrder.direction = GetRandomDirection()

    //Setting game status and stage 
    this.gameStatus = true
    this.gameStage = GameStage.CapitalSetup

    //Initializing map
    InitHexGrid(this.map)
    this.map.fieldsController.sanctuariesLeft = MAX_SANCTUARIES
    this.map.fieldsController.citadelsLeft = MAX_CITADELS
    //Initializing players decks
    this.deckManager.Init()
    // this.deckManager.DealCards()

    //Initializing trixelManager
    this.trixelManager.Init()

  }
  NextTurn(): void {
    const activePlayerId = this.turnOrder.activePlayerId
    this.players.get(activePlayerId)!.isActive = false
    const activePlayerIndex = this.turnOrder.playersId.indexOf(activePlayerId)
    let nextIndex
    if (this.turnOrder.direction === TurnOrder.clockwise) {
      nextIndex = (activePlayerIndex + 1) % this.numPlayers;
    }
    else {
      nextIndex = (activePlayerIndex - 1 + this.numPlayers) % this.numPlayers;
    }
    const newActivePlayerId = this.turnOrder.playersId[nextIndex]
    this.turnOrder.activePlayerId = newActivePlayerId
    this.players.get(newActivePlayerId)!.isActive = true
  }
  AddPlayer(player: Player): void {
    if (this.players.size < this.numPlayers) {
      this.players.set(player.id, player);
      this.turnOrder.playersId.push(player.id)
    }
  }
  AddPlayerById(userId: string): void {
    if (this.players.size < this.numPlayers) {
      const player: Player = new Player(userId)
      this.players.set(player.id, player);
      this.turnOrder.playersId.push(player.id)
    }
  }
  GetPlayerById(userId: string): Player | undefined {
    return this.players.get(userId)
  }
  GetPlayerBySocket(socketId: string): Player | undefined {
    for (const player of this.players.values()) {
      if (player.socket && player.socket.id === socketId) {
        return player;
      }
    }
    return undefined;
  }
  AddDeedToken(player: Player) {
    if (this.deedTokens < 0) {
      throw new Error("gameState.AddDeedToken: no tokens left")
    }
    this.deedTokens--
    player.deedTokens++
  }
}