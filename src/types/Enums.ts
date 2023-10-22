export enum Card_type {
    Action,
    Epos,
    Advantage,
}
export enum Timing_to_play {
    Season,
    SeasonX2,
    Trixel,
    TrixelX2,
    SeasonOrTrixel,

}
export enum Badge {
    Build,
    Clans,
    Move,
    Attack,
    MoveAndAttack,
    None
}
export enum StartStructure {
    Shrine
}
export enum playerAction {
    None = "NONE",
    Card = "CARD",
    Token = "TOKEN",
    Pass = "PASS"
}
export enum GameStage {
    CapitalSetup = "CAPITAL_SETUP",
    ClansSetup = "CLANS_SETUP",
    Gathering = "GATHERING",
    Season = "SEASON",
    Fight = "FIGHT",
    END = "END"
}
export enum TurnOrder {
    clockwise = "CLOCKWISE",
    counter_clockwise = "COUNTER_CLOCKWISE"
}
export enum ActionType {
    Atack,
    Defend
}
export enum AttackerAction {
    Atack,
    Move,
    Epos
}
export enum DeffenderAction {
    Clan,
    Card
}
export enum PretenderTokenType {
    Clans = "CLANS",
    Sanctuaries = "SAN",
    Territories = "TER"
}