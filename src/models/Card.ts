export enum Card_type {
    Action,
    Epos,
    Advantage,
}
export enum Timing_to_play {
    Season,
    Trixel,
    SeasonOrTrixel
}
export enum Badge {
    Build,
    Clans,
    Move,
    MoveAndAttack
}
export type Card = {
    readonly id: string
    readonly title: string
    readonly card_type: Card_type,
    readonly timing: Timing_to_play,
    readonly badge: Badge,
    readonly description: string
}
