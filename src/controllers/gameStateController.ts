import express, { Request, Response } from "express"
import { GameState } from "../models/GameState";
import { v4 } from "uuid";
import { gamesManager } from "../models/GameStateManager";

const CreateGameWithId = (req: Request, res: Response) => {
    const gameId: string = req.params.id;
    const gameState: GameState = new GameState(gameId)
    
    const userIds: string[] | undefined = req.body.userIds
    if (userIds) {
        userIds.forEach(id => gameState.addPlayerById(id))
    }
    gamesManager.createGame(gameState)
    res.status(200).send(`Game created with id: ${gameId}`)
}
const CreateGame = (req: Request, res: Response) => {
    const gameState: GameState = new GameState()
    const userIds: string[] | undefined = req.body.userIds
    if (userIds) {
        userIds.forEach(id => gameState.addPlayerById(id))
    }
    gamesManager.createGame(gameState)
    res.status(200).send(`Game created with id: ${gameState.Id}`)
}
const GetGames = (req: Request, res: Response) => {
    res.status(200).send(gamesManager.getGameStates())
}
const GetGame = (req: Request, res: Response) => {
    const gameId: string = req.params.id;
    res.status(200).send(gamesManager.getGame(gameId)?.toJSON())
}
const GetOnlinePlayers = (req: Request, res: Response) => {
    if(gamesManager.socketToGame.size <= 0)
    {
        return res.status(404).send('No players are online')
    }
    const socketGame = Object.fromEntries(gamesManager.socketToGame);
    res.status(200).send(socketGame)
}
export default {
    CreateGameWithId,
    CreateGame,
    GetGames,
    GetGame,
    GetOnlinePlayers
}