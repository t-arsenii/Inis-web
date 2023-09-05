import express, { Request, Response } from "express"
import { GameState } from "../models/GameState";
import { v4 } from "uuid";
import { gamesManager } from "../models/GameStateManager";

const CreateGameWithId = (req: Request, res: Response) => {
    const gameId: string = req.params.id;

    const gameState: GameState = new GameState(gameId)
    gamesManager.createGame(gameState)
    res.status(200).send(`Game created with id: ${gameId}`)
}
const CreateGame = (req: Request, res: Response) => {
    const gameId: string = v4();

    const gameState: GameState = new GameState(gameId)
    gamesManager.createGame(gameState)
    res.status(200).send(`Game created with id: ${gameId}`)
}
const GetGame = (req: Request, res: Response) => {
    res.status(200).send(gamesManager.getGameStates())
}
export default {
    CreateGameWithId,
    CreateGame,
    GetGame
}