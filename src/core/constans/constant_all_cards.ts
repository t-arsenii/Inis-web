import { Card } from "../../types/Types";
import { cardActionMap } from "./constant_action_cards";
import { cardAdvantageMap } from "./constant_advantage_cards";
import { cardEposMap } from "./constant_epos_cards";
export const cardAllMap: Map<string, Card> = new Map([...cardActionMap, ...cardAdvantageMap, ...cardEposMap]);
