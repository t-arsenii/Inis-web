import { Bard, Citadel, Conquest, Druid, NewClans, PeasantsWorkers, Sanctuary } from "../constans/constant_action_cards";
import { ICardOperationParams, ICardOperationResponse } from "../../types/Interfaces";
import { CitadelActionInfo, ConquestActionInfo, DruidActionInfo, NewClansActionInfo, PeasantsWorkersActionInfo, SanctuaryActionInfo } from "./cardActionInfo";
import { BardTrixel, CitadelSeason, ConquestSeason, DruidSeason, NewClansSeason, PeasantsWorkersSeason, SanctuarySeason } from "./cardAction";

type CardActionFunction = (params: ICardOperationParams) => void;
type CardInfoFunction = (params: ICardOperationParams) => ICardOperationResponse;
export const cardSeasonMap: Record<string, { Info: CardInfoFunction, Action: CardActionFunction }> = {
    [Sanctuary.id]: {
        Info: SanctuaryActionInfo,
        Action: SanctuarySeason
    },
    [Citadel.id]: {
        Info: CitadelActionInfo,
        Action: CitadelSeason
    },
    [NewClans.id]: {
        Info: NewClansActionInfo,
        Action: NewClansSeason
    },
    [Druid.id]: {
        Info: DruidActionInfo,
        Action: DruidSeason
    },
    [PeasantsWorkers.id]: {
        Info: PeasantsWorkersActionInfo,
        Action: PeasantsWorkersSeason
    },
    [Conquest.id]: {
        Info: ConquestActionInfo,
        Action: ConquestSeason
    }
}
export const cardTrixelMap: Record<string, { Info?: CardInfoFunction, Action: CardActionFunction }> = {
    [Bard.id]: {
        Action: BardTrixel
    }
}