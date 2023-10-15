import { Player } from "./Player";
import { v4 } from "uuid";
import { HexGrid, Hexagon } from "./map/HexGrid";
import { Deck, DeckManager } from "./DeckManager";
import { checkSockets, getRandomDirection } from "../services/helperFunctions";
import { MAX_PRETENDER_TOKENS, MAX_CITADELS, MAX_DEED_TOKENS, MAX_SANCTUARIES, MIN_WINNING_AMOUNT } from "./constans/constant_3_players";
import { TurnOrder, GameStage, PretenderTokenType, playerAction } from "../types/Enums";
import { PlayerTurnOrder } from "../types/Types";
import { InitHexGrid } from "../services/HexGridService";
import { FightManager } from "./Fighter";
import { TrixelManager } from "./TrixelManager";
import EventEmitter from "events";
import { PretenderClans, PretenderSanctuaries, PretenderTerritories } from "../services/GameStateService";

export class GameState {
  //Game info
  id: string = "";
  players: Map<string, Player> = new Map();
  numPlayers: number = 3;
  gameStatus: boolean = false
  //In game data
  turnOrder: PlayerTurnOrder
  gameStage: GameStage = undefined!
  deedTokens: number = MAX_DEED_TOKENS
  pretenderTokens: number = MAX_PRETENDER_TOKENS
  brenPlayer: Player = undefined!
  //Managers
  deckManager: DeckManager = new DeckManager(this)
  fightManager: FightManager = new FightManager(this)
  trixelManager: TrixelManager = new TrixelManager(this)
  map: HexGrid = new HexGrid(this)
  //Statistic
  roundCounter: number = 0
  //Other
  eventEmitter: EventEmitter = new EventEmitter()
  constructor(lobbyId?: string) {
    this.id = lobbyId || v4();
    this.turnOrder = {
      playersId: [],
      direction: undefined!,
      activePlayerId: ""
    }
  }
  Init(): void {
    //Checking if game is already initialized
    if (this.gameStatus) {
      throw new Error("Game is already initialized");
    }

    //Checking for all players connection
    // if (!checkSockets(this.players)) {
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
    this.brenPlayer = activePlayer
    this.turnOrder.direction = getRandomDirection()

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
  AddPlayer({ userId, username }: { userId: string, username: string }): void {
    if (this.players.size < this.numPlayers) {
      const player: Player = new Player(userId)
      player.username = username;
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
  UpdatePretender(): void {
    throw new Error("UpdatePretender exception")
  }
  TakePretenderToken(player: Player, tokenType: PretenderTokenType): void {
    const winning_amount = MIN_WINNING_AMOUNT - player.deedTokens
    let pretenderResult = false
    switch (tokenType) {
      case PretenderTokenType.Clans:
        pretenderResult = PretenderClans(this, player, winning_amount)
        player.pretenderTokens.clans = pretenderResult
        break;
      case PretenderTokenType.Sanctuaries:
        pretenderResult = PretenderSanctuaries(this, player, winning_amount)
        player.pretenderTokens.sanctuaries = pretenderResult
        break;
      case PretenderTokenType.Territories:
        pretenderResult = PretenderTerritories(this, player, winning_amount)
        player.pretenderTokens.territories = pretenderResult
        break;
      default:
        throw new Error("GameState.TakePretenderToken: error tokenType")
    }
    if (!pretenderResult) {
      throw new Error("GameState.TakePretenderToken: can't take token")
    }
  }
  TryEndRound(): void {
    let passCheck = Array.from(this.players.values()).every(player => player.lastAction === playerAction.Pass);
    if (passCheck) {
      this.trixelManager.ClearTrixel();
      this.players.forEach(player => player.lastAction = playerAction.None);
      this.map.fieldsController.ResetHolidayField();
      this.StartGatheringStage();
    }
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
    this.trixelManager.ClearTrixel() //clearing all trixel conditions data
  }
  StartGatheringStage(): void {
    this.gameStage = GameStage.Gathering;
    updateBren(this);
    updatePretenderTokens(this);
    this.UpdateWinner()
    this.turnOrder.direction = getRandomDirection()
    //Card deeling
    this.deckManager.DealAdvantageCards();
    this.deckManager.InitDealActionCards();
  }
  UpdateWinner() {
    const winnerPlayer = tryGetWinnerPlayer(this);
    if (winnerPlayer) {
      this.gameStage = GameStage.END;
      this.gameStatus = false;
      console.log("Winner player with id: " + winnerPlayer.id);
      return
    }
  }
}
function updateBren(gameState: GameState): void {
  const capitalHex: Hexagon | null = gameState.map.fieldsController.capitalHex
  if (!capitalHex) {
    return;
  }
  if (capitalHex.field.leaderPlayerId === null) {
    return;
  }
  if (capitalHex.field.leaderPlayerId !== gameState.brenPlayer.id) {
    const newBrenplayer: Player = gameState.GetPlayerById(capitalHex.field.leaderPlayerId)!;
    gameState.brenPlayer.isBren = false;
    //setting new bren
    gameState.brenPlayer = newBrenplayer;
    newBrenplayer.isBren = true;
  }
}
function updatePretenderTokens(gameState: GameState): void {
  const players: Player[] = Array.from(gameState.players.values())
  players.forEach(player => {
    const winning_amount = MIN_WINNING_AMOUNT - player.deedTokens
    if (player.pretenderTokens.clans) {
      player.pretenderTokens.clans = PretenderClans(gameState, player, winning_amount);
    }
    if (player.pretenderTokens.sanctuaries) {
      player.pretenderTokens.sanctuaries = PretenderSanctuaries(gameState, player, winning_amount);
    }
    if (player.pretenderTokens.territories) {
      player.pretenderTokens.sanctuaries = PretenderTerritories(gameState, player, winning_amount);
    }
  })
}
function tryGetWinnerPlayer(gameState: GameState): Player | null {
  let maxTokens = -Infinity;
  let playersWithMaxTokens: Player[] = [];
  const players: Player[] = Array.from(gameState.players.values());
  for (const player of players) {
    const { pretenderTokens: pretenderTokens, isBren } = player;
    const { sanctuaries, clans, territories } = pretenderTokens;
    const tokensCount = [sanctuaries, clans, territories].filter(token => token === true).length;
    if (tokensCount > 0 && tokensCount > maxTokens) {
      maxTokens = tokensCount;
      playersWithMaxTokens = [player];
    } else if (tokensCount === maxTokens) {
      playersWithMaxTokens.push(player);
    }
  }
  if (playersWithMaxTokens.length === 1) {
    return playersWithMaxTokens[0];
  }
  const brenPlayer = playersWithMaxTokens.find(player => player.isBren === true);
  if (brenPlayer) {
    return brenPlayer;
  } else {
    return null;
  }
}