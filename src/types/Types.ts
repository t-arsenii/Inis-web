
import { Badge, Card_type, StartStructure, Timing_to_play } from "./Enums"

export type Card = {
    readonly id: string
    readonly title: string
    readonly card_type: Card_type,
    readonly timing: Timing_to_play,
    readonly badge: Badge,
    readonly description?: string
    readonly trixelCondition?:string
    readonly secondDescription?: string
}

export type Territory = {
    id:string
    title:string
    description: string | undefined
    cardId:string
    startStructure: StartStructure | undefined
 }

 export type axialCoordiantes = {
    q: number
    r: number
}