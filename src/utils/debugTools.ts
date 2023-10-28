import { Player } from "../core/Player"
import { GameState } from "../core/gameState/GameState"
import { gamesManager } from "../core/gameState/GameStateManager"
import { TurnOrder, GameStage } from "../types/Enums"

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
    users.forEach(user => gameState.playerManager.AddPlayer({ userId: user.userId, username: user.userName }));
    //Adding gameState to manager
    gamesManager.createGame(gameState)

    //Initing game
    gameState.Init()

    //getting players objects
    const player1: Player = gameState.playerManager.GetPlayerById(player1Id)!
    const player2: Player = gameState.playerManager.GetPlayerById(player2Id)!
    const player3: Player = gameState.playerManager.GetPlayerById(player3Id)!

    //Overriding turn order 
    gameState.turnOrderManager.turnOrder.direction = TurnOrder.clockwise
    gameState.turnOrderManager.SetActivePlayer(player1);
    gameState.SetBrenPlayer(player1);

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
    gameState.StartSeasonStage(); //Changing game stage
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
    users.forEach(user => gameState.playerManager.AddPlayer({ userId: user.userId, username: user.userName }));
    //Adding gameState to manager
    gamesManager.createGame(gameState)

    //Initing game
    gameState.Init()
    //getting players objects
    const player1: Player = gameState.playerManager.GetPlayerById(player1Id)!
    const player2: Player = gameState.playerManager.GetPlayerById(player2Id)!
    const player3: Player = gameState.playerManager.GetPlayerById(player3Id)!
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