import { Badge, Card, Card_type, Timing_to_play } from "../../models/Card";

const Sanctuary: Card = {
    id: "f145474a-453b-4f53-8fff-12448a0ab90f",
    title: "Sanctuary",
    card_type: Card_type.Action,
    timing: Timing_to_play.Season,
    badge: Badge.Build,
    description: "Build 1 sanctuary on territory with your clans. Take 1 Epos card",
} as const;

const New_clans: Card = {
    id: "c1f5ddba-7325-4188-9a36-ff9ef14af22a",
    title: "New clans",
    card_type: Card_type.Action,
    timing: Timing_to_play.Season,
    badge: Badge.Clans,
    description: "Add 2 clans on any territory with your clans. Both clans can be added on 1 territory or 2 separate ones"
} as const;

const Conquest: Card = {
    id: "ddc241a2-2fd1-4926-8860-4eae221b93d4",
    title: "Conquest",
    card_type: Card_type.Action,
    timing: Timing_to_play.Season,
    badge: Badge.MoveAndAttack,
    description: "Choose 1 territory. You can move any number of clans from neighbours territories to it."
} as const;

export const cardDictionary: { [id: string]: Card } = {
    [Sanctuary.id]: Sanctuary,
    [New_clans.id]: New_clans,
    [Conquest.id]: Conquest,
};