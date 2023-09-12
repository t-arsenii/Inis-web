import { StartStructure, Territory } from "../../models/Territory";

const Swamp: Territory = {
    id: "aebc97ae-b2ff-4ce1-9bcb-8bc0aabca722",
    title: "Swamp",
    cardId: "",
    description: "Can't place citadel",
    startStructure: undefined
}

const Hills: Territory = {
    id: "c6729674-5dc9-430a-9acf-6644d5e75b08",
    title: "Hills",
    cardId: "",
    description: undefined,
    startStructure: undefined
}
const Mountains: Territory = {
    id: "371951b7-bb10-489a-9bf6-2269e20a2582",
    title: "Mountains",
    cardId: "",
    description: "When moving 1 or more clans, player must discard 1 clan or card",
    startStructure: undefined
}
const SaltMine: Territory = {
    id: "f014f08a-166e-4f6e-b9b6-c1586ccf07f2",
    title: "Salt Mine",
    cardId: "",
    description: undefined,
    startStructure: undefined
}
const Forest: Territory = {
    id: "a7e1710e-5442-4b6e-af98-05c00945ee6f",
    title: "Forest",
    cardId: "",
    description: undefined,
    startStructure: undefined
}
const Gates: Territory = {
    id: "df9e1676-aa00-42ce-b6f3-a80cb3a32ba7",
    title: "Gate tir-na-nor",
    cardId: "",
    description: "When turn orders changes each player with clans on that territory must discard 1 clans and take 1 epos card",
    startStructure: StartStructure.Shrine
}

const StoneCircle: Territory = {
    id: "032d22f0-0b69-423e-b713-712c86c5ecb6",
    title: "Stone circle",
    cardId: "",
    description: undefined,
    startStructure: StartStructure.Shrine
}
const Wasteland: Territory = {
    id: "154d93ca-db01-403f-a9d8-c5c03ffca4c0",
    title: "Wasteland",
    cardId: "",
    description: undefined,
    startStructure: undefined
}

const Meadow: Territory = {
    id: "d8667c62-bedf-418a-b61b-96fdaf490f25",
    title: "Meadow",
    cardId: "",
    description: undefined,
    startStructure: undefined
}

const ForgottenRavine: Territory = {
    id: "4e4ff816-4e68-46b8-888d-68bab513180d",
    title: "Forgotten ravine",
    cardId: "",
    description: undefined,
    startStructure: undefined
}

const Bay: Territory = {
    id: "8b33b5ed-8791-4893-9d29-5181a9d0772f",
    title: "Bay",
    cardId: "",
    description: undefined,
    startStructure: undefined
}

const IronMine: Territory = {
    id: "ae8c6ac5-fcf3-4ae7-ab8a-f9ddc34295a8",
    title: "Iron mine",
    cardId: "",
    description: undefined,
    startStructure: undefined
}

const MistyLands: Territory = {
    id: "3af21ed3-66ea-4c45-98de-19f9f498a111",
    title: "Misty lands",
    cardId: "",
    description: undefined,
    startStructure: undefined
}   

const Valley: Territory = {
    id: "ea936092-3844-41ea-be09-dee4a2a320ef",
    title: "Valley",
    cardId: "",
    description: undefined,
    startStructure: undefined
}

const Plains: Territory = {
    id: "287b2e08-43cd-47b9-869a-aee3afcafe15",
    title: "Plains",
    cardId: "",
    description: undefined,
    startStructure: undefined
}

const Plateau: Territory = {
    id: "b400926c-0529-4889-a28a-543b481473e6",
    title: "Plateau",
    cardId: "",
    description: undefined,
    startStructure: undefined
}

export const territoryMap: Map<string, Territory> = new Map([
    [Swamp.id, Swamp],
    [Hills.id, Hills],
    [Mountains.id, Mountains],
    [SaltMine.id, SaltMine],
    [Forest.id, Forest],
    [Gates.id, Gates],
    [StoneCircle.id, StoneCircle],
    [Wasteland.id, Wasteland],
    [Meadow.id, Meadow],
    [ForgottenRavine.id, ForgottenRavine],
    [Bay.id, Bay],
    [IronMine.id, IronMine],
    [MistyLands.id, MistyLands],
    [Valley.id, Valley],
    [Plains.id, Plains],
    [Plateau.id, Plateau],
]);