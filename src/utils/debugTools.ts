import { Player } from "../core/Player"
import { GameState } from "../core/gameState/GameState"
import { gamesManager } from "../core/gameState/GameStateManager"
import { TurnOrder, GameStage } from "../types/Enums"
import { IPlayer } from "../types/Interfaces"

export const initGameToSeason = () => {
    const DebugGameId = "54a94296-eb0b-45dc-a6f6-544559cf6b8b"
    const gameState: GameState = new GameState(DebugGameId)
    const player1Id = "6553995defc2b3f2962ef65d"
    const player2Id = "65539987efc2b3f2962ef662"
    const player3Id = "65539aa2efc2b3f2962ef66a"
    const users: IPlayer[] = [
        { id: player1Id, username: "username1", mmr: 1234 },
        { id: player2Id, username: "username2", mmr: 1582 },
        { id: player3Id, username: "username3", mmr: 1345 },
    ]
    users.forEach(user => gameState.playerManager.AddPlayer({ id: user.id, username: user.username, mmr: user.mmr }));
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
    gameState.deckManager.AddCard(player1, "f145474a-453b-4f53-8fff-12448a0ab90f");
    gameState.deckManager.AddCard(player1, "67f39e72-1838-460d-8cac-17ca18aec015");
    gameState.deckManager.AddCard(player1, "e5dd65a7-4f71-42b0-8f2d-6b0ef25c6e0a");
    gameState.deckManager.AddCard(player1, "c1f5ddba-7325-4188-9a36-ff9ef14af22a");
    gameState.deckManager.AddCard(player1, "5d8db5fa-f323-4d84-b78f-85ccad76fd6d");

    gameState.deckManager.AddCard(player2, "f145474a-453b-4f53-8fff-12448a0ab90f");
    gameState.deckManager.AddCard(player2, "67f39e72-1838-460d-8cac-17ca18aec015");
    gameState.deckManager.AddCard(player2, "e5dd65a7-4f71-42b0-8f2d-6b0ef25c6e0a");
    gameState.deckManager.AddCard(player2, "c1f5ddba-7325-4188-9a36-ff9ef14af22a");
    gameState.deckManager.AddCard(player2, "5d8db5fa-f323-4d84-b78f-85ccad76fd6d");

    gameState.deckManager.AddCard(player3, "f145474a-453b-4f53-8fff-12448a0ab90f");
    gameState.deckManager.AddCard(player3, "67f39e72-1838-460d-8cac-17ca18aec015");
    gameState.deckManager.AddCard(player3, "e5dd65a7-4f71-42b0-8f2d-6b0ef25c6e0a");
    gameState.deckManager.AddCard(player3, "c1f5ddba-7325-4188-9a36-ff9ef14af22a");
    gameState.deckManager.AddCard(player3, "5d8db5fa-f323-4d84-b78f-85ccad76fd6d");

    //Skippping setup
    gameState.hexGridManager.fieldsController.SetCapital({ q: 0, r: 0 });
    gameState.hexGridManager.fieldsController.AddSanctuary({ q: 0, r: 0 });
    gameState.hexGridManager.setupController.SkipSetupClans() //skipping setup clans
    //Adding two clans for each player
    gameState.hexGridManager.clansController.AddClans(player1, 2, { q: 0, r: 0 });
    gameState.hexGridManager.clansController.AddClans(player2, 2, { q: 0, r: 0 });
    gameState.hexGridManager.clansController.AddClans(player3, 2, { q: 0, r: 1 });
    //Skipping beginning stage
    gameState.StartSeasonStage(); //Changing game stage
}

export const initGameToGathering = () => {
    const DebugGameId = "54a94296-eb0b-45dc-a6f6-544559cf6b8b"
    const gameState: GameState = new GameState(DebugGameId)
    const player1Id = "6553995defc2b3f2962ef65d"
    const player2Id = "65539987efc2b3f2962ef662"
    const player3Id = "65539aa2efc2b3f2962ef66a"
    const users: IPlayer[] = [
        { id: player1Id, username: "username1", mmr: 1234 },
        { id: player2Id, username: "username2", mmr: 1582 },
        { id: player3Id, username: "username3", mmr: 1345 },
    ]
    users.forEach(user => gameState.playerManager.AddPlayer({ id: user.id, username: user.username, mmr: user.mmr }));
    //Adding gameState to manager
    gamesManager.createGame(gameState)

    //Initing game
    gameState.Init()
    //getting players objects
    const player1: Player = gameState.playerManager.GetPlayerById(player1Id)!
    const player2: Player = gameState.playerManager.GetPlayerById(player2Id)!
    const player3: Player = gameState.playerManager.GetPlayerById(player3Id)!
    //Adding two clans for each player
    gameState.hexGridManager.clansController.AddClans(player1, 2, { q: 0, r: 0 })
    gameState.hexGridManager.clansController.AddClans(player2, 2, { q: 0, r: 0 })
    gameState.hexGridManager.clansController.AddClans(player3, 2, { q: 0, r: 1 })
    //Skippping setup
    gameState.hexGridManager.fieldsController.SetCapital({ q: 0, r: 0 })
    gameState.hexGridManager.fieldsController.AddSanctuary({ q: 0, r: 0 })
    gameState.hexGridManager.setupController.SkipSetupClans() //skipping setup clans

    gameState.StartGatheringStage();
}