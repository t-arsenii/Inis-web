import { Player } from "../Player";
import { GameState } from "../GameState";
import { Hexagon } from "../HexGrid";
import { axialCoordiantes } from "../../types/Types";

function SanctuaryAction(gameState: GameState, playerId: string, hexCoordinates: axialCoordiantes): void {
    if (!gameState.players.has(playerId)) {
        return
    }
    if (gameState.sanctuaries <= 0) {
        return
    }
    const player: Player = gameState.players.get(playerId)!
    if (!gameState.map.grid.has(`${hexCoordinates.q},${hexCoordinates.r}`)) {
        return
    }
    const hex: Hexagon = gameState.map.grid.get(`${hexCoordinates.q},${hexCoordinates.r}`)!
    gameState.sanctuaries--
    hex.field.sanctuaryCount++
}