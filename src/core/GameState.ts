import { Player } from "./Player";
import { v4 } from "uuid";
import { HexGrid, Hexagon } from "./map/HexGrid";
import { Deck, DeckManager } from "./DeckManager";
import { GetRandomDirection, getKeyWithUniqueMaxValue, shuffle } from "../services/helperFunctions";
import { MAX_CHALLENGER_TOKENS, MAX_CITADELS, MAX_DEED_TOKENS, MAX_SANCTUARIES, MIN_WINNING_AMOUNT } from "./constans/constant_3_players";
import { TurnOrder, GameStage, ChallengerTokenType, playerAction } from "../types/Enums";
import { PlayerTurnOrder } from "../types/Types";
import { HexGridToJson, InitHexGrid } from "../services/HexGridService";
import { FightManager } from "./Fighter";
import { TrixelManager } from "./TrixelManager";
import EventEmitter from "events";
import { ChallengerClans, ChallengerSanctuaries, ChallengerTerritories } from "../services/GameStateService";
import { cardAdvantageMap } from "./constans/constant_advantage_cards";
import { territoryMap } from "./constans/constant_territories";

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
  challengerTokens: number = MAX_CHALLENGER_TOKENS
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
    this.brenPlayer = activePlayer
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
  UpdateChallenger() {
    throw new Error("UpdateChallenger exception")
  }
  TakeChallengerToken(player: Player, tokenType: ChallengerTokenType) {
    const winning_amount = MIN_WINNING_AMOUNT - player.deedTokens
    let challengerResult = false
    switch (tokenType) {
      case ChallengerTokenType.Clans:
        challengerResult = ChallengerClans(this, player, winning_amount)
        player.challengerTokens.clans = challengerResult
        break;
      case ChallengerTokenType.Sanctuaries:
        challengerResult = ChallengerSanctuaries(this, player, winning_amount)
        player.challengerTokens.sanctuaries = challengerResult
        break;
      case ChallengerTokenType.Territories:
        challengerResult = ChallengerTerritories(this, player, winning_amount)
        player.challengerTokens.territories = challengerResult
        break;
      default:
        throw new Error("GameState.TakeChallengerToken: error tokenType")
    }
    if (!challengerResult) {
      throw new Error("GameState.TakeChallengerToken: can't take token")
    }
  }
  TryEndRound() {
    let passCheck = Array.from(this.players.values()).every(player => player.lastAction === playerAction.Pass);
    if (passCheck) {
      this.gameStage = GameStage.Gathering;
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
  private StartGatheringStage(): void {
    this.gameStage = GameStage.Gathering;
    updateBren(this);
    const winnerPlayer = tryGetWinnerPlayer(this);
    if (winnerPlayer) {
      this.gameStage = GameStage.END;
      this.gameStatus = false;
      console.log("Winner player with id: " + winnerPlayer.id);
      return
    }
    this.turnOrder.direction = GetRandomDirection()
    //Card deeling
    this.deckManager.DealSeasonCards()
    this.deckManager.DealAdvantageCards()
  }
}
function updateBren(gameState: GameState) {
  const capitalHex: Hexagon | undefined = gameState.map.fieldsController.capital
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
function updateChallengerTokens(gameState: GameState) {
  const players: Player[] = Array.from(gameState.players.values())
  players.forEach(player => {
    const winning_amount = MIN_WINNING_AMOUNT - player.deedTokens
    if (player.challengerTokens.clans) {
      player.challengerTokens.clans = ChallengerClans(gameState, player, winning_amount);
    }
    if (player.challengerTokens.sanctuaries) {
      player.challengerTokens.sanctuaries = ChallengerSanctuaries(gameState, player, winning_amount);
    }
    if (player.challengerTokens.territories) {
      player.challengerTokens.sanctuaries = ChallengerTerritories(gameState, player, winning_amount);
    }
  })
}
function tryGetWinnerPlayer(gameState: GameState): Player | null {
  let maxTokens = -Infinity;
  let playersWithMaxTokens: Player[] = [];
  const players: Player[] = Array.from(gameState.players.values());
  for (const player of players) {
    const { challengerTokens, isBren } = player;
    const { sanctuaries, clans, territories } = challengerTokens;
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