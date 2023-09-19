import { Player } from "../Player";
import { GameState } from "../GameState";
import { Hexagon } from "../HexGrid";
import { axialCoordiantes } from "../../types/Types";
import { Sanctuary, cardActionsMap } from "../../constans/constans_cards";
import { SanctuaryActionInfo } from "./cardActionsInfo";
import { ICardOperationParams } from "../../types/Interfaces";
interface ICardOperationBase {
    gameState: GameState,
    player: Player
}
export function SanctuaryAction({ gameState, player, axial }: ICardOperationParams): void {
    if (gameState.sanctuariesLeft <= 0) {
        return
    }
    const hex: Hexagon | undefined = gameState.map.GetHex(axial!)
    if (!hex) {
        return
    }
    gameState.sanctuariesLeft--
    hex.field.sanctuaryCount++
    //Add Epos card to player
}