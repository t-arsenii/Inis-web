import { Badge, Card_type, Timing_to_play } from "../../types/Enums";
import { Card } from "../../types/Types";

const DagdaHarp: Card = {
    id: "b90e911f-9a3f-4686-bd7c-4abe07f16b0a",
    title: "Dagda Harp",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Trixel,
    badge: Badge.Clans
}//in progress

const DagdaBoiler: Card = {
    id: "9bd813a1-a124-4a5d-8070-55104ceda3ec",
    title: "Dagda boiler",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Trixel,
    badge: Badge.None
}
const DeirdresBeauty: Card = {
    id: "81b038ea-685a-4fe6-a280-452bc70f861d",
    title: "Deirdre's Beauty",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Trixel,
    badge: Badge.None
}
const Eriu: Card = {
    id: "b02fe111-83d6-4ada-b29e-1f47534f9039",
    title: "Eriu",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Season,
    badge: Badge.Clans
}//in progress
const Rampage: Card = {
    id: "",
    title: "Rampage",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Trixel,
    badge: Badge.None
}
const HeroShare: Card = {
    id: "",
    title: "Hero's share",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Season,
    badge: Badge.None
}//in progress
const Dagda: Card = {
    id: "",
    title: "Dagda",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Trixel,
    badge: Badge.None
}
const Dogma: Card = {
    id: "",
    title: "The eloquence of dogma",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Trixel,
    badge: Badge.None
}
const EyeOfBalor: Card = {
    id: "",
    title: "Eye of Balor",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Season,
    badge: Badge.None
}//in progress
const TyrannyOfBres: Card = {
    id: "",
    title: "Tyranny of Bres",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Season,
    badge: Badge.Move
}//in progress
const DagdaСlub: Card = {
    id: "",
    title: "Dagda's club",
    card_type: Card_type.Epos,
    timing: Timing_to_play.TrixelX2,
    badge: Badge.None
}
const BattleOfMagTuired: Card = {
    id: "",
    title: "Battle of Mag Tuired",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Trixel,
    badge: Badge.MoveAndClans
}
const DanuChildren: Card = {
    id: "",
    title: "Danu's children",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Season,
    badge: Badge.Clans
}//in progress
//oenghus trick
const FalStone: Card = {
    id: "",
    title: "Fal's stone",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Season,
    badge: Badge.Clans
}//in progress
const SanctuaryOfCernunnos: Card = {
    id: "",
    title: "Sanctuary of Cernunnos",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Season,
    badge: Badge.BuildAndClans
}//in progress
//land tallin
//meadow samildanah
//Lug's spear
const ManannanHorses: Card = {
    id: "",
    title: "Manannan Horses",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Season,
    badge: Badge.MoveAndAttack
}//in progress
//Srenga's determination
const AnotherWorld: Card = {
    id: "",
    title: "Another world",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Season,
    badge: Badge.Clans
}//in progress
//catbad prophecy
//nuada argetlam
//Diarmuid and Grainne
//legend of cuchulainn
//Tuan's memory
//Medb's wealth
//morrigan
//fiana
export const cardEposMap: Map<string, Card> = new Map([
    [DagdaHarp.id, DagdaHarp],
    [HeroShare.id, HeroShare],
    [EyeOfBalor.id, EyeOfBalor],
    [DanuChildren.id, DanuChildren],
    [FalStone.id, FalStone]
]);

export {
    DagdaHarp,
    HeroShare,
    EyeOfBalor,
    DanuChildren,
    FalStone
}
//DagdaHarpSeason,
//HeroShareSeason,
//EyeOfBalorSeason,
//DanuChildrenSeason,
//FalStoneSeason