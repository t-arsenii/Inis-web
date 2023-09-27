import { Bard, Citadel, Conquest, Druid, NewClans, PeasantsWorkers, Sanctuary } from "../../constans/constant_action_cards";
import { ICardOperationParams, ICardOperationResponse } from "../../types/Interfaces";
import { CitadelActionInfo, ConquestActionInfo, DruidActionInfo, NewClansActionInfo, PeasantsWorkersActionInfo, SanctuaryActionInfo } from "./cardActionInfo";
import { CitadelAction, ConquestAction, DruidAction, NewClansAction, PeasantsWorkersAction, SanctuaryAction } from "./cardAction";
import { BardTrixel } from "./cardTrixel";

type CardActionFunction = (params: ICardOperationParams) => void;
type CardInfoFunction = (params: ICardOperationParams) => ICardOperationResponse;
export const cardSeasonMap: Record<string, { Info: CardInfoFunction, Action: CardActionFunction }> = {
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
    },
    [Conquest.id]: {
        Info: ConquestActionInfo,
        Action: ConquestAction
    }
}
export const cardEposMap: Record<string, { Info?: CardInfoFunction, Action: CardActionFunction }> = {
    [Bard.id]: {
        Action: BardTrixel
    }
}