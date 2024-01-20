import { Badge, Card_type, Timing_to_play } from "../../types/Enums";
import { CardType } from "../../types/Types";

const DagdaHarp: CardType = {
    id: "b90e911f-9a3f-4686-bd7c-4abe07f16b0a",
    title: "Dagda Harp",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Trixel,
    badge: Badge.Clans
}//in progress

const DagdaBoiler: CardType = {
    id: "9bd813a1-a124-4a5d-8070-55104ceda3ec",
    title: "Dagda boiler",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Trixel,
    badge: Badge.None
}
const DeirdresBeauty: CardType = {
    id: "81b038ea-685a-4fe6-a280-452bc70f861d",
    title: "Deirdre's Beauty",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Trixel,
    badge: Badge.None
}
const Eriu: CardType = {
    id: "b02fe111-83d6-4ada-b29e-1f47534f9039",
    title: "Eriu",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Season,
    badge: Badge.Clans
}//in progress
const Rampage: CardType = {
    id: "",
    title: "Rampage",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Trixel,
    badge: Badge.None
}
const HeroShare: CardType = {
    id: "",
    title: "Hero's share",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Season,
    badge: Badge.None
}//in progress
const Dagda: CardType = {
    id: "",
    title: "Dagda",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Trixel,
    badge: Badge.None
}
const Dogma: CardType = {
    id: "",
    title: "The eloquence of dogma",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Trixel,
    badge: Badge.None
}
const EyeOfBalor: CardType = {
    id: "",
    title: "Eye of Balor",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Season,
    badge: Badge.None
}//in progress
const TyrannyOfBres: CardType = {
    id: "",
    title: "Tyranny of Bres",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Season,
    badge: Badge.Move
}//in progress
const DagdaСlub: CardType = {
    id: "",
    title: "Dagda's club",
    card_type: Card_type.Epos,
    timing: Timing_to_play.TrixelX2,
    badge: Badge.None
}
const BattleOfMagTuired: CardType = {
    id: "",
    title: "Battle of Mag Tuired",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Trixel,
    badge: Badge.MoveAndClans
}
const DanuChildren: CardType = {
    id: "",
    title: "Danu's children",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Season,
    badge: Badge.Clans
}//in progress
//oenghus trick
const FalStone: CardType = {
    id: "",
    title: "Fal's stone",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Season,
    badge: Badge.Clans
}//in progress
const SanctuaryOfCernunnos: CardType = {
    id: "",
    title: "Sanctuary of Cernunnos",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Season,
    badge: Badge.BuildAndClans
}//in progress
//land tallin
//meadow samildanah
//Lug's spear
const ManannanHorses: CardType = {
    id: "",
    title: "Manannan Horses",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Season,
    badge: Badge.MoveAndAttack
}//in progress
//Srenga's determination
const AnotherWorld: CardType = {
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
export const cardEposMap: Map<string, CardType> = new Map([
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