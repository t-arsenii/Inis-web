import { Citadel, Druid, NewClans, PeasantsWorkers, Sanctuary } from "../../constans/constans_cards";
import { ICardOperationParams, ICardOperationResponse } from "../../types/Interfaces";
import { GameState } from "../GameState";
import { Hexagon } from "../HexGrid";
import { Player } from "../Player";
import { CitadelActionInfo, DruidActionInfo, NewClansActionInfo, PeasantsWorkersActionInfo, SanctuaryActionInfo } from "./cardActionsInfo";
import { CitadelAction, DruidAction, NewClansAction, PeasantsWorkersAction, SanctuaryAction } from "./cardActions";

type CardActionFunction = (params: ICardOperationParams) => void;
type CardInfoFunction = (gameState: GameState, player: Player) => ICardOperationResponse;
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
    },
    [Druid.id]: {
        Info: DruidActionInfo,
        Action: DruidAction
    },
    [PeasantsWorkers.id]: {
        Info: PeasantsWorkersActionInfo,
        Action: PeasantsWorkersAction
    }
}