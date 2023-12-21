import { TurnOrder } from "../../types/Enums";
import { PlayerTurnOrderType } from "../../types/Types";
import { getRandomDirection, shuffle } from "../../utils/helperFunctions";
import { Player } from "../Player";
import { GameState } from "./GameState";

export class TurnOrderManager {

  _gameState: GameState;
  turnOrder: PlayerTurnOrderType;

  constructor(gameState: GameState) {
    this._gameState = gameState;
    this.turnOrder = {
      playersId: [],
      direction: undefined!,
      activePlayerId: ""
    }
  }
  GetActivePlayer(): Player {
    return this._gameState.playerManager.GetPlayerById(this.turnOrder.activePlayerId)!;
  }
  GetDirection(): string {
    return this.turnOrder.direction;
  }
  NextTurn(): void {
    const playerIdsInOrder = this.turnOrder.playersId;
    const numberOfPlayers = this._gameState.playerManager.numPlayers;
    const activePlayerIndex = playerIdsInOrder.indexOf(this.turnOrder.activePlayerId);
    let nextIndex;
    if (this.turnOrder.direction === TurnOrder.clockwise) {
      nextIndex = (activePlayerIndex + 1) % numberOfPlayers;
    }
    else {
      nextIndex = (activePlayerIndex - 1 + numberOfPlayers) % numberOfPlayers;
    }
    const newActivePlayer = this._gameState.playerManager.GetPlayerById(playerIdsInOrder[nextIndex])!;
    this.SetActivePlayer(newActivePlayer);
    this._gameState.trixelManager.ClearTrixel();
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
  SetActivePlayer(player: Player) {
    const currentActivePlayer: Player = this.GetActivePlayer();
    currentActivePlayer.isActive = false;

    this.turnOrder.activePlayerId = player.id;
    player.isActive = true;
  }
  GetPlayerIdsInOrder(): string[] {
    return this.turnOrder.playersId.slice();
  }
}