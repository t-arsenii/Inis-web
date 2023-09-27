import { Citadel, Conquest, Druid, NewClans, PeasantsWorkers, Sanctuary } from "../../constans/constans_action_cards";
import { ICardOperationParams, ICardOperationResponse } from "../../types/Interfaces";
import { CitadelActionInfo, ConquestActionInfo, DruidActionInfo, NewClansActionInfo, PeasantsWorkersActionInfo, SanctuaryActionInfo } from "./cardActionsInfo";
import { CitadelAction, ConquestAction, DruidAction, NewClansAction, PeasantsWorkersAction, SanctuaryAction } from "./cardActions";

type CardActionFunction = (params: ICardOperationParams) => void;
type CardInfoFunction = (params: ICardOperationParams) => ICardOperationResponse;
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
    },
    [Conquest.id]: {
        Info: ConquestActionInfo,
        Action: ConquestAction
    }
}