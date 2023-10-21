import EventEmitter from "events";
import { v4 } from "uuid";
import { InitHexGrid } from "../../utils/HexGridUtils";
import { PretenderClans, PretenderSanctuaries, PretenderTerritories, tryGetWinnerPlayer, getBrenPlayer, updatePretenderTokens } from "../../utils/gameStateUtils";
import { checkSockets, getRandomDirection, shuffle } from "../../utils/helperFunctions";
import { GameStage, PretenderTokenType, playerAction, TurnOrder } from "../../types/Enums";
import { PlayerTurnOrder } from "../../types/Types";
import { DeckManager } from "../DeckManager";
import { Player } from "../Player";
import { TrixelManager } from "../TrixelManager";
import { MAX_DEED_TOKENS, MAX_PRETENDER_TOKENS, MAX_SANCTUARIES, MAX_CITADELS, MIN_WINNING_AMOUNT } from "../constans/constant_3_players";
import { FightManager } from "../fight/FightManager";
import { HexGrid } from "../map/HexGrid";
import { TurnOrderManager } from "./TurnOrderManager";
import { PlayerManager } from "./PlayerManager";
import { GameUiUpdater } from "./GameUIUpdater";
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
  uiUpdater: GameUiUpdater;
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
    this.uiUpdater = new GameUiUpdater(this);
    //Statistic
    this.roundCounter = 0;
    //Other
    this.eventEmitter = new EventEmitter();

  }
  public Init(): void {
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

    //Initializing players decks
    this.deckManager.Init();

    //Initializing trixelManager
    this.trixelManager.Init();
  }

  public AddDeedToken(player: Player) {
    if (this.deedTokensLeft < 0) {
      throw new Error("gameState.AddDeedToken: no tokens left");
    }
    this.deedTokensLeft--;
    player.deedTokens++;
  }
  public TakePretenderToken(player: Player, tokenType: PretenderTokenType): void {
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
  public EndSeasonStage(): void {
    const players = this.playerManager.GetPlayers();
    this.trixelManager.ClearTrixel();
    players.forEach(player => player.lastAction = playerAction.None);
    this.map.fieldsController.ResetHolidayField();
  }
  public StartGatheringStage(): void {
    this.gameStage = GameStage.Gathering;

    const newBrenplayer = getBrenPlayer(this);
    this.SetBrenPlayer(newBrenplayer);

    updatePretenderTokens(this);
    this.UpdateWinner();
    this.turnOrderManager.SetRandomDirection();
    this.turnOrderManager.SetActivePlayer(this.brenPlayer);
    //Card deeling
    this.deckManager.DealAdvantageCards();
    this.deckManager.InitDealActionCards();
  }
  private UpdateWinner() {
    const winnerPlayer = tryGetWinnerPlayer(this);
    if (winnerPlayer) {
      this.gameStage = GameStage.END;
      this.gameStatus = false;
      console.log("Winner player with id: " + winnerPlayer.id);
      return;
    }
  }
  public SetBrenPlayer(newBrenPlayer: Player) {
    if (newBrenPlayer !== this.brenPlayer) {
      this.brenPlayer.isBren = false;
      newBrenPlayer.isBren = true;
      this.brenPlayer = newBrenPlayer;
    }
  }
}