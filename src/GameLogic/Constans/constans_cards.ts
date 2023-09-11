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

const Bard: Card = {
    id: "",
    title: "Bard",
    card_type: Card_type.Action,
    timing: Timing_to_play.SeasonOrTrixel,
    badge: Badge.None,
    description: ""
} as const;

const NewClans: Card = {
    id: "",
    title: "New clans",
    card_type: Card_type.Action,
    timing: Timing_to_play.Season,
    badge: Badge.Clans,
    description: ""
} as const;

const Druid: Card = {
    id: "",
    title: "Druid",
    card_type: Card_type.Action,
    timing: Timing_to_play.Season,
    badge: Badge.None,
    description: ""
} as const;

const PeasantsWorkers: Card = {
    id: "",
    title: "Peasants and workers",
    card_type: Card_type.Action,
    timing: Timing_to_play.Season,
    badge: Badge.Clans,
    description: ""
} as const;

const NewUnion: Card = {
    id: "",
    title: "New union",
    card_type: Card_type.Action,
    timing: Timing_to_play.Season,
    badge: Badge.Clans,
    description: ""
} as const;

const Exploration: Card = {
    id: "",
    title: "Exploration",
    card_type: Card_type.Action,
    timing: Timing_to_play.Season,
    badge: Badge.Clans,
    description: ""
} as const;

const Commander: Card = {
    id: "",
    title: "Commander",
    card_type: Card_type.Action,
    timing: Timing_to_play.SeasonOrTrixel,
    badge: Badge.Attack,
    description: ""
} as const;

const Holiday: Card = {
    id: "",
    title: "Holiday",
    card_type: Card_type.Action,
    timing: Timing_to_play.Season,
    badge: Badge.Clans,
    description: ""
} as const;

const Relocation: Card = {
    id: "",
    title: "Relocation",
    card_type: Card_type.Action,
    timing: Timing_to_play.Season,
    badge: Badge.MoveAndAttack,
    description: ""
} as const;

const Citadel: Card = {
    id: "",
    title: "Сitadel",
    card_type: Card_type.Action,
    timing: Timing_to_play.Season,
    badge: Badge.Build,
    description: ""
} as const;

const Geist: Card = {
    id: "",
    title: "Geist",
    card_type: Card_type.Action,
    timing: Timing_to_play.Trixel,
    badge: Badge.None,
    description: ""
} as const;

export const cardMap: Map<string, Card> = new Map([
    [Sanctuary.id, Sanctuary],
    [New_clans.id, New_clans],
    [Conquest.id, Conquest],
    [Bard.id, Bard],
    [NewClans.id, NewClans],
    [Druid.id, Druid],
    [PeasantsWorkers.id, PeasantsWorkers],
    [NewUnion.id, NewUnion],
    [Exploration.id, Exploration],
    [Commander.id, Commander],
    [Holiday.id, Holiday],
    [Relocation.id, Relocation],
    [Citadel.id, Citadel],
    [Geist.id, Geist]
]);