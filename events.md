#Events list
##1. Server on events
###game Events
```js
socket.on("game-join", (gameId: string, userId: string))
```
Использовать в useEffect для подключения к игре

###game **Setup** Events
```js
socket.on("game-setup-clans", (axial: axialCoordinates))
axialCoordinates = {
    q: number
    r: number
}
```
Во время фазы "установки кланов", **когда игрок активен**, yстанавливает 1 клан

```js
socket.on("game-setup-capital", (axial: axialCoordinates))
```
Во время фазы "установки столицы", **когда игрок активен и является бреном**, yстанавливает столицу

###player **Game** Events
```js
socket.on("player-card-season", ({ cardId, params }: IPlayerCardInput))
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
socket.on("player-card-info", ({ cardId, params }: IPlayerCardInput))
```
```js
socket.on("player-token", ({ type }: IPretenderTokenInput))
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
socket.on("player-pass", ())
```

```js
socket.on('player-card-deal', ({ cardIds }: IPlayerCardDealInput))
IPlayerCardDealInput {
    cardIds: string[]
}
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
