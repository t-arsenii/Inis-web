import { Citadel, NewClans, Sanctuary } from "../../constans/constans_cards";
import { ICardOperationParams } from "../../types/Interfaces";
import { GameState } from "../GameState";
import { Hexagon } from "../HexGrid/HexGrid";
import { Player } from "../Player";
import { CitadelActionInfo, NewClansActionInfo, SanctuaryActionInfo } from "./cardActionsInfo";
import { CitadelAction, NewClansAction, SanctuaryAction } from "./cardAtions";

type CardActionFunction = (params: ICardOperationParams) => void;
type CardInfoFunction = (gameState: GameState, player: Player) => any;
export const cardOperationsMapping: Record<string, { Info: CardInfoFunction, Action: CardActionFunction }> = {
    [Sanctuary.id]: {
        Info: SanctuaryActionInfo,
        Action: SanctuaryAction
    },
    [Citadel.id]: {
        Info: CitadelActionInfo,
        Action: CitadelAction
    },
    [NewClans.id]: {
        Info: NewClansActionInfo,
        Action: NewClansAction
    }
}