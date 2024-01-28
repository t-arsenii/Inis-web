import { Card_type, Timing_to_play, Badge } from "../../types/Enums";
import { CardType } from "../../types/Types";
//Advantage Cards
export const Forest: CardType = {
    id: "16bea132-7365-47c3-a2ce-9610a82eceff",
    title: "Forest",
    card_type: Card_type.Advantage,
    timing: Timing_to_play.Trixel,
    badge: Badge.None,
    trixelCondition: "After you play epos card",
    secondDescription: "Take 1 epos card"
} as const

export const Wasteland: CardType = {
    id: "34a38528-7fa9-4063-9e6a-3de4f89cfe73",
    title: "Wasteland",
    card_type: Card_type.Advantage,
    timing: Timing_to_play.Trixel,
    badge: Badge.None,
    trixelCondition: ""
} as const

export const Meadow: CardType = {
    id: "446d3f6c-2388-4c6d-8951-021ed0cf40c0",
    title: "Meadow",
    card_type: Card_type.Advantage,
    timing: Timing_to_play.Trixel,
    badge: Badge.None,
    trixelCondition: "",
    description: ""
} as const

export const IronMine: CardType = {
    id: "e0730202-87c1-403f-9a35-a0f41334aa57",
    title: "Iron mine",
    card_type: Card_type.Advantage,
    timing: Timing_to_play.Trixel,
    badge: Badge.None,
    trixelCondition: "",
    description: ""
} as const

export const Mountains: CardType = {
    id: "8287c9aa-295d-488b-b61a-84ac34cbbb8f",
    title: "Mountains",
    card_type: Card_type.Advantage,
    timing: Timing_to_play.Trixel,
    badge: Badge.None,
    trixelCondition: "",
    description: ""
} as const

export const Gates: CardType = {
    id: "ef64a71d-eb20-4d15-85c5-28aa0bf0b69d",
    title: "Gates",
    card_type: Card_type.Advantage,
    timing: Timing_to_play.Trixel,
    badge: Badge.None,
    trixelCondition: "",
    description: ""
} as const

export const StoneCircle: CardType = {
    id: "a1ff40f8-cf3c-43a4-94f3-3f544d187fd1",
    title: "Stone circle",
    card_type: Card_type.Advantage,
    timing: Timing_to_play.Trixel,
    badge: Badge.None,
    trixelCondition: "",
    description: ""
} as const

export const Plateau: CardType = {
    id: "9e5cc7eb-4eb9-41a2-9de7-2967debb1b03",
    title: "Plateau",
    card_type: Card_type.Advantage,
    timing: Timing_to_play.Trixel,
    badge: Badge.None,
    trixelCondition: "",
    description: ""
} as const

export const Plains: CardType = {
    id: "f4030b37-b5e6-4a62-be5a-161891094327",
    title: "Plains",
    card_type: Card_type.Advantage,
    timing: Timing_to_play.Season,
    badge: Badge.MoveAndAttack,
    description: ""
} as const

export const Valley: CardType = {
    id: "11f9026c-f165-479f-b1cd-88e8408cdbbe",
    title: "Valley",
    card_type: Card_type.Advantage,
    timing: Timing_to_play.Trixel,
    badge: Badge.Clans,
    description: ""
} as const

export const MistyLands: CardType = {
    id: "2bec5ffa-be5f-425c-b045-48ce989a17de",
    title: "MistyLands",
    card_type: Card_type.Advantage,
    timing: Timing_to_play.Season,
    badge: Badge.None,
    description: ""
} as const

export const Hills: CardType = {
    id: "09e02abe-0d43-4ee2-a56b-09035bc9a472",
    title: "Hills",
    card_type: Card_type.Advantage,
    timing: Timing_to_play.Trixel,
    badge: Badge.None,
    description: ""
} as const

export const ForgottenRavine: CardType = {
    id: "f9ff726b-952e-41bc-81d2-a44de80537b9",
    title: "Forgotten ravine",
    card_type: Card_type.Advantage,
    timing: Timing_to_play.Trixel,
    badge: Badge.Move,
    description: ""
} as const

export const Bay: CardType = {
    id: "91cd1bfe-14b1-4963-afca-82f593514ef9",
    title: "Bay",
    card_type: Card_type.Advantage,
    timing: Timing_to_play.Trixel,
    badge: Badge.None,
    description: ""
} as const

export const SaltMine: CardType = {
    id: "ae75ef7b-e1ac-4bc7-9ee0-0ba95417873f",
    title: "Salt mine",
    card_type: Card_type.Advantage,
    timing: Timing_to_play.Trixel,
    badge: Badge.None,
    description: ""
} as const

export const Swamp: CardType = {
    id: "9a803125-8f32-46ac-aee7-6bfd528a26ba",
    title: "Swamp",
    card_type: Card_type.Advantage,
    timing: Timing_to_play.Trixel,
    badge: Badge.None,
    description: ""
}
export const cardAdvantageMap: Map<string, CardType> = new Map([
    [Forest.id, Forest],
    [Wasteland.id, Wasteland],
    [Meadow.id, Meadow],
    [IronMine.id, IronMine],
    [Mountains.id, Mountains],
    [Gates.id, Gates],
    [StoneCircle.id, StoneCircle],
    [Plateau.id, Plateau],
    [Plains.id, Plains],
    [Valley.id, Valley],
    [MistyLands.id, MistyLands],
    [Hills.id, Hills],
    [ForgottenRavine.id, ForgottenRavine],
    [Bay.id, Bay],
    [SaltMine.id, SaltMine],
    [Swamp.id, Swamp]
]);