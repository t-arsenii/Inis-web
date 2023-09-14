import { Player } from "../Player";
import { GameState } from "../GameState";
import { Hexagon } from "../HexGrid";
import { axialCoordiantes } from "../../types/Types";
import { Sanctuary, cardActionsMap } from "../../constans/constans_cards";

function SanctuaryAction(gameState: GameState, player: Player, axial: axialCoordiantes): void {
    if (gameState.sanctuariesCount <= 0) {
        return
    }
    if (!gameState.map.grid.has(`${axial.q},${axial.r}`)) {
        return
    }
    const hex: Hexagon = gameState.map.grid.get(`${axial.q},${axial.r}`)!
    gameState.sanctuariesCount--
    hex.field.sanctuaryCount++
}