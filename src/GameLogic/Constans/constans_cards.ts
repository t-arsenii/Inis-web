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
    id: "9422292c-bd05-40b5-95bc-140dbd6bb3c2",
    title: "Bard",
    card_type: Card_type.Action,
    timing: Timing_to_play.SeasonOrTrixel,
    badge: Badge.None,
    description: ""
} as const;

const NewClans: Card = {
    id: "b0b388b0-802f-4522-aef4-b66c8df9aff9",
    title: "New clans",
    card_type: Card_type.Action,
    timing: Timing_to_play.Season,
    badge: Badge.Clans,
    description: ""
} as const;

const Druid: Card = {
    id: "6b9ed192-ea8f-4fb9-b55f-985a32b344b5",
    title: "Druid",
    card_type: Card_type.Action,
    timing: Timing_to_play.Season,
    badge: Badge.None,
    description: ""
} as const;

const PeasantsWorkers: Card = {
    id: "3d138112-6a36-467a-8255-bcfb42fe7398",
    title: "Peasants and workers",
    card_type: Card_type.Action,
    timing: Timing_to_play.Season,
    badge: Badge.Clans,
    description: ""
} as const;

const NewUnion: Card = {
    id: "df9b3113-f639-4d74-9e6c-a88c98cdcafa",
    title: "New union",
    card_type: Card_type.Action,
    timing: Timing_to_play.Season,
    badge: Badge.Clans,
    description: ""
} as const;

const Exploration: Card = {
    id: "5d8db5fa-f323-4d84-b78f-85ccad76fd6d",
    title: "Exploration",
    card_type: Card_type.Action,
    timing: Timing_to_play.Season,
    badge: Badge.Clans,
    description: ""
} as const;

const Commander: Card = {
    id: "2233b6e1-be5f-4a3d-af68-1aa3c7cfe1b4",
    title: "Commander",
    card_type: Card_type.Action,
    timing: Timing_to_play.SeasonOrTrixel,
    badge: Badge.Attack,
    description: ""
} as const;

const Holiday: Card = {
    id: "e5dd65a7-4f71-42b0-8f2d-6b0ef25c6e0a",
    title: "Holiday",
    card_type: Card_type.Action,
    timing: Timing_to_play.Season,
    badge: Badge.Clans,
    description: ""
} as const;

const Relocation: Card = {
    id: "bea2a567-9011-493d-9965-7d12b2d4aaf6",
    title: "Relocation",
    card_type: Card_type.Action,
    timing: Timing_to_play.Season,
    badge: Badge.MoveAndAttack,
    description: ""
} as const;

const Citadel: Card = {
    id: "67f39e72-1838-460d-8cac-17ca18aec015",
    title: "Сitadel",
    card_type: Card_type.Action,
    timing: Timing_to_play.Season,
    badge: Badge.Build,
    description: ""
} as const;

const Geist: Card = {
    id: "d18d8527-d0aa-47da-b291-7aa222ef3132",
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