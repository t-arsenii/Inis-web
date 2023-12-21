import { CardType } from "../../types/Types";
import { cardActionMap } from "./constant_action_cards";
import { cardAdvantageMap } from "./constant_advantage_cards";
import { cardEposMap } from "./constant_epos_cards";
const cardAllMap: Map<string, CardType> = new Map([...cardActionMap, ...cardAdvantageMap, ...cardEposMap]);
export { cardAllMap }
