import { Sanctuary } from "../../constans/constans_cards";
import { ICardOperationParams } from "../../types/Interfaces";
import { GameState } from "../GameState";
import { Hexagon } from "../HexGrid";
import { Player } from "../Player";
import { SanctuaryActionInfo } from "./cardActionsInfo";
import { SanctuaryAction } from "./cardAtions";

type CardActionFunction = (params: ICardOperationParams) => void;
type CardInfoFunction = (gameState: GameState, player: Player) => any;
export const cardOperationsMapping: Record<string, { Info: CardInfoFunction, Action: CardActionFunction }> = {
    [Sanctuary.id]: {
        Info: SanctuaryActionInfo,
        Action: SanctuaryAction
    }
}