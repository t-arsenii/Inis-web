import { Bard, Citadel, Conquest, Druid, Exploration, Holiday, NewClans, PeasantsWorkers, Sanctuary, NewUnion } from "../constans/constant_action_cards";
import { ICardOperationParams, ICardOperationResponse } from "../../types/Interfaces";
import { CitadelActionInfo, ConquestActionInfo, DruidActionInfo, ExplorationActionInfo, HolidayActionInfo, NewClansActionInfo, NewUnionActionInfo, PeasantsWorkersActionInfo, SanctuaryActionInfo } from "./cardActionInfo";
import { BardTrixel, CitadelSeason, ConquestSeason, DruidSeason, NewClansSeason, PeasantsWorkersSeason, SanctuarySeason, ExplorationSeason, HolidaySeason, NewUnionSeason } from "./cardAction";

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
    },
    [Exploration.id]: {
        Info: ExplorationActionInfo,
        Action: ExplorationSeason
    },
    [Holiday.id]: {
        Info: HolidayActionInfo,
        Action: HolidaySeason
    },
    [NewUnion.id]: {
        Info: NewUnionActionInfo,
        Action: NewUnionSeason
    }
}
export const cardTrixelMap: Record<string, { Info?: CardInfoFunction, Action: CardActionFunction }> = {
    [Bard.id]: {
        Action: BardTrixel
    }
}