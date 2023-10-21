import EventEmitter from "events";
import { v4 } from "uuid";
import { InitHexGrid } from "../../utils/HexGridUtils";
import { PretenderClans, PretenderSanctuaries, PretenderTerritories, tryGetWinnerPlayer, updateBren, updatePretenderTokens } from "../../utils/gameStateUtils";
import { checkSockets, getRandomDirection, shuffle } from "../../utils/helperFunctions";
import { GameStage, PretenderTokenType, playerAction, TurnOrder } from "../../types/Enums";
import { PlayerTurnOrder } from "../../types/Types";
import { DeckManager } from "../DeckManager";
import { Player } from "../Player";
import { TrixelManager } from "../TrixelManager";
import { MAX_DEED_TOKENS, MAX_PRETENDER_TOKENS, MAX_SANCTUARIES, MAX_CITADELS, MIN_WINNING_AMOUNT } from "../constans/constant_3_players";
import { FightManager } from "../fight/FightManager";
import { HexGrid } from "../map/HexGrid";
class PlayerManager {
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
  HasPlayer(playerId: string):boolean {
    return this.players.has(playerId);
  }
}

class TurnOrderManager {

  _gameState: GameState;
  turnOrder: PlayerTurnOrder;

  constructor(gameState: GameState) {
    this._gameState = gameState;
    this.turnOrder = {
      playersId: [],
      direction: undefined!,
      activePlayerId: ""
    }
  }
  GetActivePlayer(): Player | undefined {
    return this._gameState.playerManager.GetPlayerById(this.turnOrder.activePlayerId);
  }
  NextTurn(): void {
    const numberOfPlayers = this._gameState.playerManager.numPlayers;
    const activePlayer: Player = this.GetActivePlayer()!;
    activePlayer.isActive = false;
    const activePlayerIndex = this.turnOrder.playersId.indexOf(this.turnOrder.activePlayerId);
    let nextIndex;
    if (this.turnOrder.direction === TurnOrder.clockwise) {
      nextIndex = (activePlayerIndex + 1) % numberOfPlayers;
    }
    else {
      nextIndex = (activePlayerIndex - 1 + numberOfPlayers) % numberOfPlayers;
    }
    const newActivePlayerId = this.turnOrder.playersId[nextIndex];
    this.turnOrder.activePlayerId = newActivePlayerId;
    this._gameState.playerManager.GetPlayerById(newActivePlayerId)!.isActive = true;
    this._gameState.trixelManager.ClearTrixel(); //clearing all trixel conditions data
  }
  SetRandomDirection() {
    this.turnOrder.direction = getRandomDirection();
  }
  Init() {
    const players = this._gameState.playerManager.GetPlayers();
    const playersId = players.map((player) => player.id);
    this.turnOrder.playersId = shuffle(playersId);
    const activePlayerId = this.turnOrder.playersId[0];
    this.turnOrder.activePlayerId = activePlayerId;
    const activePlayer: Player | undefined = this._gameState.playerManager.GetPlayerById(activePlayerId);
    if (!activePlayer) {
      return;
    }
    activePlayer.isActive = true;
  }
}


export class GameState {
  //Game info
  id: string;
  gameStatus: boolean;
  //In game data
  gameStage: GameStage;
  deedTokensLeft: number;
  pretenderTokensLeft: number;
  brenPlayer: Player = undefined!;
  //Managers
  deckManager: DeckManager;
  fightManager: FightManager;
  trixelManager: TrixelManager;
  playerManager: PlayerManager;
  turnOrderManager: TurnOrderManager;
  map: HexGrid;
  //Statistic
  roundCounter: number;
  //Other
  eventEmitter: EventEmitter;
  constructor(lobbyId?: string) {
    //Game Info
    this.id = lobbyId || v4();
    this.gameStatus = false;
    //In game data
    this.gameStage = undefined!;
    this.deedTokensLeft = MAX_DEED_TOKENS;
    this.pretenderTokensLeft = MAX_PRETENDER_TOKENS;
    this.brenPlayer = undefined!;
    //Managers
    this.deckManager = new DeckManager(this);
    this.fightManager = new FightManager(this);
    this.trixelManager = new TrixelManager(this);
    this.playerManager = new PlayerManager(this);
    this.turnOrderManager = new TurnOrderManager(this);
    this.map = new HexGrid(this);
    //Statistic
    this.roundCounter = 0;
    //Other
    this.eventEmitter = new EventEmitter();

  }
  Init(): void {
    //Checking if game is already initialized
    if (this.gameStatus) {
      throw new Error("Game is already initialized");
    }
    //Checking for all players connection
    // if (!checkSockets(this.playerManager.GetPlayers())) {
    //   throw new Error("Not all socket are connected");
    // }

    this.turnOrderManager.Init();
    this.turnOrderManager.SetRandomDirection();

    //Setting bren
    const activePlayer = this.turnOrderManager.GetActivePlayer()!;
    activePlayer.isBren = true;
    this.brenPlayer = activePlayer;

    //Setting game status and stage 
    this.gameStatus = true;
    this.gameStage = GameStage.CapitalSetup;

    //Initializing map
    this.map.Init();
    this.map.fieldsController.sanctuariesLeft = MAX_SANCTUARIES;
    this.map.fieldsController.citadelsLeft = MAX_CITADELS;

    //Initializing players decks
    this.deckManager.Init();

    //Initializing trixelManager
    this.trixelManager.Init();
  }

  AddDeedToken(player: Player) {
    if (this.deedTokensLeft < 0) {
      throw new Error("gameState.AddDeedToken: no tokens left");
    }
    this.deedTokensLeft--;
    player.deedTokens++;
  }
  TakePretenderToken(player: Player, tokenType: PretenderTokenType): void {
    if (this.pretenderTokensLeft <= 0) {
      throw new Error("Not pretender tokens left");
    }
    const winning_amount = MIN_WINNING_AMOUNT - player.deedTokens;
    let pretenderResult = false;

    switch (tokenType) {
      case PretenderTokenType.Clans:
        if (player.pretenderTokens.clans) {
          return;
        }
        pretenderResult = PretenderClans(this, player, winning_amount);
        player.pretenderTokens.clans = pretenderResult;
        break;
      case PretenderTokenType.Sanctuaries:
        if (player.pretenderTokens.sanctuaries) {
          return;
        }
        pretenderResult = PretenderSanctuaries(this, player, winning_amount);
        player.pretenderTokens.sanctuaries = pretenderResult;
        break;
      case PretenderTokenType.Territories:
        if (player.pretenderTokens.territories) {
          return;
        }
        pretenderResult = PretenderTerritories(this, player, winning_amount);
        player.pretenderTokens.territories = pretenderResult;
        break;
      default:
        throw new Error("GameState.TakePretenderToken: error tokenType");
    }
    if (!pretenderResult) {
      throw new Error("GameState.TakePretenderToken: can't take token");
    }
    this.pretenderTokensLeft--;
  }
  TryEndRound(): void {
    const players = this.playerManager.GetPlayers();
    let passCheck = players.every(player => player.lastAction === playerAction.Pass);
    if (passCheck) {
      this.trixelManager.ClearTrixel();
      players.forEach(player => player.lastAction = playerAction.None);
      this.map.fieldsController.ResetHolidayField();
      this.StartGatheringStage();
    }
  }
  StartGatheringStage(): void {
    this.gameStage = GameStage.Gathering;
    updateBren(this);
    updatePretenderTokens(this);
    this.UpdateWinner();
    this.turnOrderManager.SetRandomDirection();
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
      return;
    }
  }
}