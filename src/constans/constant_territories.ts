import { StartStructure } from "../types/Enums";
import { Territory } from "../types/Types";
import { Hills, Mountains, SaltMine, Swamp, Forest, cardAdvantageMap, Gates, StoneCircle, Wasteland, Meadow, ForgottenRavine, Bay, IronMine, MistyLands, Valley, Plains, Plateau } from "./constant_advantage_cards";
const Swamp_ter: Territory = {
    id: "aebc97ae-b2ff-4ce1-9bcb-8bc0aabca722",
    title: "Swamp",
    cardId: Swamp.id,
    description: "Can't place citadel",
    startStructure: undefined
}

const Hills_ter: Territory = {
    id: "c6729674-5dc9-430a-9acf-6644d5e75b08",
    title: "Hills",
    cardId: Hills.id,
    description: undefined,
    startStructure: undefined
}
const Mountains_ter: Territory = {
    id: "371951b7-bb10-489a-9bf6-2269e20a2582",
    title: "Mountains",
    cardId: Mountains.id,
    description: "When moving 1 or more clans, player must discard 1 clan or card",
    startStructure: undefined
}
const SaltMine_ter: Territory = {
    id: "f014f08a-166e-4f6e-b9b6-c1586ccf07f2",
    title: "Salt Mine",
    cardId: SaltMine.id,
    description: undefined,
    startStructure: undefined
}
const Forest_ter: Territory = {
    id: "a7e1710e-5442-4b6e-af98-05c00945ee6f",
    title: "Forest",
    cardId: Forest.id,
    description: undefined,
    startStructure: undefined
}
const Gates_ter: Territory = {
    id: "df9e1676-aa00-42ce-b6f3-a80cb3a32ba7",
    title: "Gate tir-na-nor",
    cardId: Gates.id,
    description: "When turn orders changes each player with clans on that territory must discard 1 clans and take 1 epos card",
    startStructure: StartStructure.Shrine
}

const StoneCircle_ter: Territory = {
    id: "032d22f0-0b69-423e-b713-712c86c5ecb6",
    title: "Stone circle",
    cardId: StoneCircle.id,
    description: undefined,
    startStructure: StartStructure.Shrine
}
const Wasteland_ter: Territory = {
    id: "154d93ca-db01-403f-a9d8-c5c03ffca4c0",
    title: "Wasteland",
    cardId: Wasteland.id,
    description: undefined,
    startStructure: undefined
}

const Meadow_ter: Territory = {
    id: "d8667c62-bedf-418a-b61b-96fdaf490f25",
    title: "Meadow",
    cardId: Meadow.id,
    description: undefined,
    startStructure: undefined
}

const ForgottenRavine_ter: Territory = {
    id: "4e4ff816-4e68-46b8-888d-68bab513180d",
    title: "Forgotten ravine",
    cardId: ForgottenRavine.id,
    description: undefined,
    startStructure: undefined
}

const Bay_ter: Territory = {
    id: "8b33b5ed-8791-4893-9d29-5181a9d0772f",
    title: "Bay",
    cardId: Bay.id,
    description: undefined,
    startStructure: undefined
}

const IronMine_ter: Territory = {
    id: "ae8c6ac5-fcf3-4ae7-ab8a-f9ddc34295a8",
    title: "Iron mine",
    cardId: IronMine.id,
    description: undefined,
    startStructure: undefined
}

const MistyLands_ter: Territory = {
    id: "3af21ed3-66ea-4c45-98de-19f9f498a111",
    title: "Misty lands",
    cardId: MistyLands.id,
    description: undefined,
    startStructure: undefined
}

const Valley_ter: Territory = {
    id: "ea936092-3844-41ea-be09-dee4a2a320ef",
    title: "Valley",
    cardId: Valley.id,
    description: undefined,
    startStructure: undefined
}

const Plains_ter: Territory = {
    id: "287b2e08-43cd-47b9-869a-aee3afcafe15",
    title: "Plains",
    cardId: Plains.id,
    description: undefined,
    startStructure: undefined
}

const Plateau_ter: Territory = {
    id: "b400926c-0529-4889-a28a-543b481473e6",
    title: "Plateau",
    cardId: Plateau.id,
    description: undefined,
    startStructure: undefined
}
export const territoryMap: Map<string, Territory> = new Map([
    [Hills_ter.id, Hills_ter],
    [Swamp_ter.id, Swamp_ter],
    [Mountains_ter.id, Mountains_ter],
    [SaltMine_ter.id, SaltMine_ter],
    [Forest_ter.id, Forest_ter],
    [Gates_ter.id, Gates_ter],
    [StoneCircle_ter.id, StoneCircle_ter],
    [Wasteland_ter.id, Wasteland_ter],
    [Meadow_ter.id, Meadow_ter],
    [ForgottenRavine_ter.id, ForgottenRavine_ter],
    [Bay_ter.id, Bay_ter],
    [IronMine_ter.id, IronMine_ter],
    [MistyLands_ter.id, MistyLands_ter],
    [Valley_ter.id, Valley_ter],
    [Plains_ter.id, Plains_ter],
    [Plateau_ter.id, Plateau_ter],
]);