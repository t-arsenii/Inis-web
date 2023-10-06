import { Badge, Card_type, Timing_to_play } from "../../types/Enums";
import { Card } from "../../types/Types";

export const DagdaHarp: Card = {
    id: "b90e911f-9a3f-4686-bd7c-4abe07f16b0a",
    title: "Dagda Harp",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Trixel,
    badge: Badge.Clans
}
export const DagdaBoiler: Card = {
    id: "9bd813a1-a124-4a5d-8070-55104ceda3ec",
    title: "Dagda boiler",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Trixel,
    badge: Badge.None
}
export const DeirdresBeauty: Card = {
    id: "81b038ea-685a-4fe6-a280-452bc70f861d",
    title: "Deirdre's Beauty",
    card_type: Card_type.Epos,
    timing: Timing_to_play.Trixel,
    badge: Badge.None
}
export const cardEposMap: Map<string, Card> = new Map([
    [DagdaHarp.id, DagdaHarp],
    [DagdaBoiler.id, DagdaBoiler],
    [DeirdresBeauty.id, DeirdresBeauty],
]);   