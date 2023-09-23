import { Player } from "../core/Player";
import { GameState } from "../core/GameState";
import { axialCoordiantes } from "../types/Types";
import { Socket } from "socket.io";
import { gamesManager } from "../core/GameStateManager";
import { GameStage, TurnOrder } from "../types/Enums";
import { Deck } from "../core/DeckManager";
export function shuffle<T>(array: T[]): T[] {
    const shuffledArray = array.slice(); // Copy the original array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}
export function CheckSockets(playersMap: Map<string, Player>): boolean {
    const players: Player[] = Array.from(playersMap.values())
    for (const player of players) {
        if (!player.socket) {
            return false;
        }
    }
    return true
}
export function GetRandomDirection(): TurnOrder {
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


export const initData = () => {
    const gameId = "54a94296-eb0b-45dc-a6f6-544559cf6b8b"
    const gameState: GameState = new GameState(gameId)
    const player1Id = "6dd6246a-f15b-43f8-bd67-5a38aa91184e"
    const player2Id = "66182a83-8824-481a-8889-39b60ab361fd"
    const player3Id = "363ed71a-056c-4fc6-9779-7dcc38d31e9c"
    const userIds: string[] = [
        player1Id,
        player2Id,
        player3Id
    ]
    if (userIds) {
        userIds.forEach(id => gameState.AddPlayerById(id))
    }
    //Adding gameState to manager
    gamesManager.createGame(gameState)

    //Initing game
    gameState.InitGame()

    //getting players objects
    const player1: Player = gameState.GetPlayerById(player1Id)!
    const player2: Player = gameState.GetPlayerById(player2Id)!
    const player3: Player = gameState.GetPlayerById(player3Id)!

    //Overriding turn order 
    gameState.turnOrder.direction = TurnOrder.clockwise
    gameState.turnOrder.activePlayerId = player1.id

    //Adding cards to players
    // const Cards = shuffle(Array.from(cardActionsMap.keys()))
    gameState.deckManager.addCard(player1, "f145474a-453b-4f53-8fff-12448a0ab90f")
    gameState.deckManager.addCard(player1, "c1f5ddba-7325-4188-9a36-ff9ef14af22a")
    gameState.deckManager.addCard(player1, "6b9ed192-ea8f-4fb9-b55f-985a32b344b5")
    gameState.deckManager.addCard(player1, "3d138112-6a36-467a-8255-bcfb42fe7398")
    gameState.deckManager.addCard(player1, "67f39e72-1838-460d-8cac-17ca18aec015")

    gameState.deckManager.addCard(player2, "6b9ed192-ea8f-4fb9-b55f-985a32b344b5")
    gameState.deckManager.addCard(player2, "3d138112-6a36-467a-8255-bcfb42fe7398")
    gameState.deckManager.addCard(player2, "67f39e72-1838-460d-8cac-17ca18aec015")
    //Skipping beginning stage
    //setting capital
    gameState.map.fieldsController.SetCapital({ q: 0, r: 0 })

    //Adding two clans for each player
    gameState.map.clansController.AddClans(player1, 2, { q: 0, r: 0 })
    gameState.map.clansController.AddClans(player2, 2, { q: 0, r: 0 })
    gameState.map.clansController.AddClans(player3, 2, { q: 0, r: 1 })
    gameState.map.setupController.SkipSetupClans()

    //Changing game stage
    gameState.gameStage = GameStage.Gathering
}