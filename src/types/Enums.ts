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
    MoveAndClans,
    BuildAndClans,
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
    Atack = "ATACK",
    Move = "MOVE",
    Epos = "EPOS"
}
export enum DeffenderAction {
    Clan = "CLAN",
    Card = "CARD"
}
export enum PretenderTokenType {
    Clans = "CLANS",
    Sanctuaries = "SAN",
    Territories = "TER"
}
export enum FightStage {
    setup = "SETUP",
    fight = "FIGHT"
}
export enum Color {
    red = "red",
    green = "green",
    blue = "blue",
    yellow = "yellow",
    purple = "purple",
    orange = "orange"
}