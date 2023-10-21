import { TurnOrder } from "../../types/Enums";
import { PlayerTurnOrder } from "../../types/Types";
import { getRandomDirection, shuffle } from "../../utils/helperFunctions";
import { Player } from "../Player";
import { GameState } from "./GameState";

export class TurnOrderManager {

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
  GetActivePlayer(): Player {
    return this._gameState.playerManager.GetPlayerById(this.turnOrder.activePlayerId)!;
  }
  NextTurn(): void {
    const numberOfPlayers = this._gameState.playerManager.numPlayers;
    const activePlayer: Player = this.GetActivePlayer();
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
  SetActivePlayer(player: Player){
    this.turnOrder.activePlayerId = player.id;
  }
}