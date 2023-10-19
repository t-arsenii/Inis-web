import EventEmitter from "events";
import { v4 } from "uuid";
import { InitHexGrid } from "../../utils/HexGridUtils";
import { PretenderClans, PretenderSanctuaries, PretenderTerritories, tryGetWinnerPlayer, updateBren, updatePretenderTokens } from "../../utils/gameStateUtils";
import { getRandomDirection } from "../../utils/helperFunctions";
import { GameStage, PretenderTokenType, playerAction, TurnOrder } from "../../types/Enums";
import { PlayerTurnOrder } from "../../types/Types";
import { DeckManager } from "../DeckManager";
import { Player } from "../Player";
import { TrixelManager } from "../TrixelManager";
import { MAX_DEED_TOKENS, MAX_PRETENDER_TOKENS, MAX_SANCTUARIES, MAX_CITADELS, MIN_WINNING_AMOUNT } from "../constans/constant_3_players";
import { FightManager } from "../fight/FightManager";
import { HexGrid } from "../map/HexGrid";

export class GameState {
  //Game info
  id: string = "";
  players: Map<string, Player> = new Map();
  numPlayers: number = 3;
  gameStatus: boolean = false;
  //In game data
  turnOrder: PlayerTurnOrder;
  gameStage: GameStage = undefined!;
  deedTokensLeft: number = MAX_DEED_TOKENS;
  pretenderTokensLeft: number = MAX_PRETENDER_TOKENS;
  brenPlayer: Player = undefined!;
  //Managers
  deckManager: DeckManager = new DeckManager(this);
  fightManager: FightManager = new FightManager(this);
  trixelManager: TrixelManager = new TrixelManager(this);
  map: HexGrid = new HexGrid(this);
  //Statistic
  roundCounter: number = 0;
  //Other
  eventEmitter: EventEmitter = new EventEmitter();
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
    const activePlayerId = this.turnOrder.playersId[0];
    this.turnOrder.activePlayerId = activePlayerId;
    //Setting bren boolean in active player object
    const activePlayer: Player | undefined = this.GetPlayerById(activePlayerId);
    if (!activePlayer) {
      return;
    }
    activePlayer.isActive = true;
    activePlayer.isBren = true;
    this.brenPlayer = activePlayer;
    this.turnOrder.direction = getRandomDirection();

    //Setting game status and stage 
    this.gameStatus = true;
    this.gameStage = GameStage.CapitalSetup;

    //Initializing map
    InitHexGrid(this.map);
    this.map.fieldsController.sanctuariesLeft = MAX_SANCTUARIES;
    this.map.fieldsController.citadelsLeft = MAX_CITADELS;
    //Initializing players decks
    this.deckManager.Init();

    //Initializing trixelManager
    this.trixelManager.Init();

    this.StartGatheringStage();
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
    if (this.deedTokensLeft < 0) {
      throw new Error("gameState.AddDeedToken: no tokens left")
    }
    this.deedTokensLeft--
    player.deedTokens++
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