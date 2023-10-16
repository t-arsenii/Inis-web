import { Player } from "../core/Player";
import { GameState } from "../gameState/GameState";
import { axialCoordiantes } from "../types/Types";
import { Socket } from "socket.io";
import { gamesManager } from "../gameState/GameStateManager";
import { GameStage, TurnOrder } from "../types/Enums";
import { Deck } from "../core/DeckManager";
import { Hexagon } from "../core/map/HexagonField";

export function shuffle<T>(array: T[]): T[] {
    const shuffledArray = array.slice(); // Copy the original array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}
export function checkSockets(playersMap: Map<string, Player>): boolean {
    const players: Player[] = Array.from(playersMap.values())
    for (const player of players) {
        if (!player.socket) {
            return false;
        }
    }
    return true
}
export function getRandomDirection(): TurnOrder {
    const randomValue = Math.random();
    if (randomValue < 0.5) {
        return TurnOrder.clockwise;
    } else {
        return TurnOrder.counter_clockwise;
    }
}

export function AxialToString(axial: axialCoordiantes): string {
    return `${axial.q},${axial.r}`
}

export function hexToAxialCoordinates(hex: Hexagon): axialCoordiantes {
    return { q: hex.q, r: hex.r }
}

export function CheckSocketGameConnection(socket: Socket, gameId: string): boolean {
    if (!gamesManager.socketsConnInfo.has(socket.id)) {
        return false
    }
    return true
}
export function GetGameStateAndPlayer(socket: Socket, gameId: string, userId: string) {
    const gameState: GameState | undefined = gamesManager.getGame(gameId);
    if (!gameState) {
        socket.emit('join-game-error', { status: "failed", message: `Game with id: ${gameId}, is not found` })
        return undefined
    }
    const player: Player | undefined = gameState?.GetPlayerById(userId)
    if (!player) {
        socket.emit('join-game-error', { status: "failed", message: `Player with id: ${userId}, is not found in existing game: ${gameId}` })
        return undefined
    }
    return { gameState, player }
}

export const initGameToGathering = () => {
    const DebugGameId = "54a94296-eb0b-45dc-a6f6-544559cf6b8b"
    const gameState: GameState = new GameState(DebugGameId)
    const player1Id = "6dd6246a-f15b-43f8-bd67-5a38aa91184e"
    const player2Id = "66182a83-8824-481a-8889-39b60ab361fd"
    const player3Id = "363ed71a-056c-4fc6-9779-7dcc38d31e9c"
    const users: { userId: string, userName: string }[] = [
        { userId: player1Id, userName: "username1" },
        { userId: player2Id, userName: "username2" },
        { userId: player3Id, userName: "username3" },
    ]
    users.forEach(user => gameState.AddPlayer({ userId: user.userId, username: user.userName }));
    //Adding gameState to manager
    gamesManager.createGame(gameState)

    //Initing game
    gameState.Init()
    //getting players objects
    const player1: Player = gameState.GetPlayerById(player1Id)!
    const player2: Player = gameState.GetPlayerById(player2Id)!
    const player3: Player = gameState.GetPlayerById(player3Id)!
    //Adding two clans for each player
    gameState.map.clansController.AddClans(player1, 2, { q: 0, r: 0 })
    gameState.map.clansController.AddClans(player2, 2, { q: 0, r: 0 })
    gameState.map.clansController.AddClans(player3, 2, { q: 0, r: 1 })
    //Skippping setup
    gameState.map.fieldsController.SetCapital({ q: 0, r: 0 })
    gameState.map.fieldsController.AddSanctuary({ q: 0, r: 0 })
    gameState.map.setupController.SkipSetupClans() //skipping setup clans

    gameState.StartGatheringStage();
}
export const initGameToSeason = () => {
    const DebugGameId = "54a94296-eb0b-45dc-a6f6-544559cf6b8b"
    const gameState: GameState = new GameState(DebugGameId)
    const player1Id = "6dd6246a-f15b-43f8-bd67-5a38aa91184e"
    const player2Id = "66182a83-8824-481a-8889-39b60ab361fd"
    const player3Id = "363ed71a-056c-4fc6-9779-7dcc38d31e9c"
    const users: { userId: string, userName: string }[] = [
        { userId: player1Id, userName: "username1" },
        { userId: player2Id, userName: "username2" },
        { userId: player3Id, userName: "username3" },
    ]
    users.forEach(user => gameState.AddPlayer({ userId: user.userId, username: user.userName }));
    //Adding gameState to manager
    gamesManager.createGame(gameState)

    //Initing game
    gameState.Init()

    //getting players objects
    const player1: Player = gameState.GetPlayerById(player1Id)!
    const player2: Player = gameState.GetPlayerById(player2Id)!
    const player3: Player = gameState.GetPlayerById(player3Id)!

    //Overriding turn order 
    gameState.turnOrder.direction = TurnOrder.clockwise
    gameState.turnOrder.activePlayerId = player1.id

    //Adding cards to players
    // const Cards = shuffle(Array.from(cardActionsMap.keys()))
    gameState.deckManager.AddCard(player1, "f145474a-453b-4f53-8fff-12448a0ab90f")
    gameState.deckManager.AddCard(player1, "c1f5ddba-7325-4188-9a36-ff9ef14af22a")
    gameState.deckManager.AddCard(player1, "6b9ed192-ea8f-4fb9-b55f-985a32b344b5")
    gameState.deckManager.AddCard(player1, "3d138112-6a36-467a-8255-bcfb42fe7398")
    gameState.deckManager.AddCard(player1, "67f39e72-1838-460d-8cac-17ca18aec015")
    gameState.deckManager.AddCard(player1, "ddc241a2-2fd1-4926-8860-4eae221b93d4")
    gameState.deckManager.AddCard(player1, "9422292c-bd05-40b5-95bc-140dbd6bb3c2")
    gameState.deckManager.AddCard(player1, "e5dd65a7-4f71-42b0-8f2d-6b0ef25c6e0a")

    gameState.deckManager.AddCard(player2, "6b9ed192-ea8f-4fb9-b55f-985a32b344b5")
    gameState.deckManager.AddCard(player2, "3d138112-6a36-467a-8255-bcfb42fe7398")
    gameState.deckManager.AddCard(player2, "67f39e72-1838-460d-8cac-17ca18aec015")
    //Skippping setup
    gameState.map.fieldsController.SetCapital({ q: 0, r: 0 })
    gameState.map.fieldsController.AddSanctuary({ q: 0, r: 0 })
    gameState.map.setupController.SkipSetupClans() //skipping setup clans
    //Adding two clans for each player
    gameState.map.clansController.AddClans(player1, 2, { q: 0, r: 0 })
    gameState.map.clansController.AddClans(player2, 2, { q: 0, r: 0 })
    gameState.map.clansController.AddClans(player3, 2, { q: 0, r: 1 })
    //Skipping beginning stage
    gameState.gameStage = GameStage.Season //Changing game stage
}

export function getKeyWithUniqueMaxValue(map: Map<string, number>) {
    let maxKey = null;
    let maxValue = -Infinity;
    let isUnique = true;
    for (const [key, value] of Object.entries(map)) {
        if (value > maxValue) {
            maxKey = key;
            maxValue = value;
            isUnique = true; // Reset isUnique when a new maximum value is found
        } else if (value === maxValue) {
            isUnique = false; // There is another key with the same maximum value
        }
    }
    return isUnique ? maxKey : null;
}

export function getKeysWithMaxValue(map: Map<string, number>) {
    let maxKeys: string[] = [];
    let maxValue = -Infinity;
    map.forEach((value, key) => {
        if (value > maxValue) {
            maxKeys = [key];
            maxValue = value;
        } else if (value === maxValue) {
            maxKeys.push(key);
        }
    })

    return maxKeys;
}