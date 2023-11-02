#Events list
##1. Server on events
###Game Events
```js
on("game-join", (gameId: string, userId: string))
```
Использовать в useEffect для подключения к игре

###Game **Setup** Events
```js
on("game-setup-clans", (axial: axialCoordinates))
axialCoordinates = {
    q: number
    r: number
}
```
Во время фазы "установки кланов", **когда игрок активен**, yстанавливает 1 клан

```js
on("game-setup-capital", (axial: axialCoordinates))
```
Во время фазы "установки столицы", **когда игрок активен и является бреном**, yстанавливает столицу

###Player **Game** Events
```js
on("player-card-season", ({ cardId, params }: IPlayerCardInput))
IPlayerCardInput {
    cardId: string,
    params?: ICardParams
}
ICardParams {
    axial?: axialCoordinates | axialCoordinates[]
    targetPlayerId?: string,
    axialToNum?: { axial: axialCoordinates, num: number }[] | { axial: axialCoordinates, num: number }
    targetCardId?: string,
    CardVariation?: number
}
```

```js
on("player-card-info", ({ cardId, params }: IPlayerCardInput))
```
```js
on("player-token", ({ type }: IPretenderTokenInput))
IPretenderTokenInput {
    type: PretenderTokenType
}
PretenderTokenType {
    Clans = "CLANS",
    Sanctuaries = "SAN",
    Territories = "TER"
}
```
```js
on("player-pass", ())
```

```js
on('player-card-deal', ({ cardIds }: IPlayerCardDealInput))
IPlayerCardDealInput {
    cardIds: string[]
}
```
###Player fight Events
```js
on("player-fight-attacker", (playerAction: IAttackerInputParams))
IAttackerInputParams {
    attackerAction: AttackerAction,
    axial?: axialCoordinates,
    targetPlayerId?: string,
    clansNum?: number
}
AttackerAction {
    Atack = "ATACK",
    Move = "MOVE",
    Epos = "EPOS"
}
```

```js
on("player-fight-deffender", (params: IDeffenderInputParams))
IDeffenderInputParams {
    deffenderAction: DeffenderAction,
    cardId?: string
}
```

```js
on("player-fight-peace-vote", ())
Голосование за мир во время сражения. Голосовать можно в любой момент сражения, даже не в свой ход
```
##1. Server emit events

```js
emit("map-update", IMapUiInfo)
IMapUiInfo {
    capital: axialCoordinates | null;
    holiday: axialCoordinates | null;
    hexGrid: {
        q: number;
        r: number;
        field: Field;
    }[];
    terLeft: number;
}
Field{
    territoryId: string;
    sanctuaryCount: number;
    citadelsCount: number;
    leaderPlayerId: string | null;
    playerClans: {
        [k: string]: number;
    };
}
```

```js
emit("my-deck-update", IMyDeckUiInfo)
IMyDeckUiInfo {
    ActionCards: string[],
    EposCards: string[],
    AdvantagesCards: string[]
}
```

```js
emit("sidebar-update", ISidebarUiInfo)
ISidebarUiInfo {
    players: {
        id: string,
        username: string,
        mmr: number,
        deck: {
            Epos: number,
            Action: number,
            Advantage: number
        },
        clans: number,
        tokens: {
            deed: number,
            pretender: number
        },
        isBren: boolean,
        isActive: boolean,
        lastAction: playerAction
    }[],
    turnDirection: string
}
```

```js
emit("game-update", IGameUiInfo);
IGameUiInfo {
    gameStatus: boolean,
    maxPlayers: number,
    citadelsLeft: number,
    sanctuariesLeft: number,
    gameStage: GameStage
}
GameStage {
    CapitalSetup = "CAPITAL_SETUP",
    ClansSetup = "CLANS_SETUP",
    Gathering = "GATHERING",
    Season = "SEASON",
    Fight = "FIGHT",
    END = "END"
}
```

```js
emit("dealCards-update", IDealCardsInfo)
IDealCardsInfo {
    cardsToDiscardNum: number,
    cardIds: string[]
}
```

```js
emit("fight-update", IFightUiInfo);
IFightUiInfo {
    fightHex: axialCoordinates,
    players:
    {
        playerId: string,
        clansNum: number,
        peace: boolean,
        isActive: boolean
    }[]
}
```

```js
emit("attackCycle-update", IAttackCycleUiInfo);
IAttackCycleUiInfo {
    status: boolean,
    attackerPlayerId: string | null,
    defenderPlayerId: string | null
}
```

```js
emit("me-info", IMeUiInfo);
interface IMeUiInfo {
    id: string
    username: string,
    mmr: number,
    color?: string
}
```