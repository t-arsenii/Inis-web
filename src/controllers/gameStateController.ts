import express, { Request, Response } from "express"
import { GameState } from "../models/GameState";
import { v4 } from "uuid";
import { gamesManager } from "../models/GameStateManager";
import { playerInfo } from "../models/GameStateManager";

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
    res.status(200).send(`Game created with id: ${gameState.id}`)
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
    const arrayOfMaps: Array<Record<string, any>> = Array.from(gamesManager.socketToGame.entries()).map(([socketId, playerInfo]) =>
    convertPlayerInfoToFormat(socketId, playerInfo)
  );
    res.status(200).send(arrayOfMaps)
}

function convertPlayerInfoToFormat(socketId: string, playerInfo: playerInfo): Record<string, any> {
    return {
      socket: socketId,
      playerInfo: {
        gameId: playerInfo.gameState.id,
        playerId: playerInfo.player.Id,
      },
    };
  }
  

export default {
    CreateGameWithId,
    CreateGame,
    GetGames,
    GetGame,
    GetOnlinePlayers
}