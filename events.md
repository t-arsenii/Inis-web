#Events list
##1. Server events
###Game Events
```js
on("game-join", (gameId: string, userId: string))
```
Использовать в useEffect для подключения к игре

###Game **Setup** Events
Это иветны, которые используются только для 1 и 2 фаз игры (CAPITAL_SETUP, CLANS_SETUP)
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
axialCoordinates = {
    q: number
    r: number
}
```
Во время фазы "установки столицы", **когда игрок активен и является бреном** он может yстановить столицу

###Player **Game** Events
Это ивенты которые используются во время фазы **SEASON** и **GATHERING**
####Ивенты фазы SEASON
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
Ивент для разыгровки карты.
```js
on("player-card-info", ({ cardId, params }: IPlayerCardInput)) ->

socket.emit("player-card-info", ICardOperationResponse)
ICardOperationResponse {
    axial?: axialCoordinates[],
    cardIds?: string[],
    maxTerClicks?: number,
    maxCardClicks?: number,
    maxTargetPlayerClicks?: number
    axialToNum?: { axial: axialCoordinates, num: number }[],
    axialToPlayerId?: { axialCoordinates: axialCoordinates, playerIds: string[] }[]
}
```
Ивент для получения данных о вариантах разыгровки карты. Отправляет сообщение на ивент **player-card-info** вместе с обьектом типа **ICardOperationResponse**.
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
Ивент для токена. Просто нужно в свой ход отправить тип токена, который игрок **попробует** взять. Если игрок успешно взял токен, ход заканчивается.
```js
on("player-pass", ())
```
Ивент для паса. Автоматически заканчивает ход игрока.
```js
on("next-turn", ())
```
Ивент для окончания своего хода. По логике нужно вызывать этот ивент после разыгровки карты сезона. Но пока что главное условие это чтобы игрок был активен(его ход), поэтому могут быть **баги**.
####Ивенты фазы **GATHERING**
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
Ивент для выполнения действия игрока во время сражения. Игрок может выполнить 1 из 3 действий написанных в **AttackerAction**. Вместе с типом действия клиент игрока, который совершает действие, должен отправить доп. данные. Если игрок выбрал атаку, то нужно отправить id другого игрока, если игрок выбрал движение с территории, то нужно отправить кол-во кланнов и координату территории на которую игрок будет двигаться.
Если игрок все же выбрал атаку, то действие будет совершенно только после того, как защищающийся игрок выберет действие для защиты(клан или карта), после этого ход в битве переходит след. игроку.
```js
on("player-fight-deffender", (params: IDeffenderInputParams))
IDeffenderInputParams {
    deffenderAction: DeffenderAction,
    cardId?: string
}
DeffenderAction {
    Clan = "CLAN",
    Card = "CARD"
}
```
Ивент для игрока, который будет защищаться. Тут все просто, если игрок выбрал действие для сброса клана, то доп. данные не нужны, если игрок выбрал действие для сброса карты, то нужно еще указать **cardId**. 
```js
on("player-fight-peace-vote", ())
```
Ивент для голосования за мир во время сражения. Тут еще проще,  голосовать можно в любой момент сражения, даже не в свой ход. Когда все игроки вызвали этот ивент, тобеж проголосовали за мир, сражение сразу заканчивается.
**Отменить свой голос нельзя.**
##1. Server UI update events

```js
on("map-update") ->
 
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
on("my-deck-update") ->

emit("my-deck-update", IMyDeckUiInfo)
IMyDeckUiInfo {
    ActionCards: string[],
    EposCards: string[],
    AdvantagesCards: string[]
}
```

```js
on("sidebar-update") ->

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
on("game-update") ->

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
on("dealCards-update") ->

emit("dealCards-update", IDealCardsInfo)
IDealCardsInfo {
    cardsToDiscardNum: number,
    cardIds: string[]
}
```

```js
on("fight-update") ->

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
on("attackCycle-update") ->

emit("attackCycle-update", IAttackCycleUiInfo);
IAttackCycleUiInfo {
    status: boolean,
    attackerPlayerId: string | null,
    defenderPlayerId: string | null
}
```

```js
on("me-info") ->

emit("me-info", IMeUiInfo);
interface IMeUiInfo {
    id: string
    username: string,
    mmr: number,
    color?: string
}
```

```js
on("allPlayers-info") ->

emit("allPlayers-info", IPlayersUiInfo)
IPlayersUiInfo {
    players: {
        id: string
        username: string,
        mmr: number,
        color?: string
    }[]
}
```