import express, { Request, Response } from "express"
import { GameState } from "../gameState/GameState";
import { v4 } from "uuid";
import { gamesManager } from "../gameState/GameStateManager";
import { playerInfo } from "../types/Types";
import { GameStateToJSON, GameStateToJSONFormated } from "../services/gameStateService";

interface IUserReq {
    userId: string,
    username: string
}

const CreateGameWithId = (req: Request, res: Response) => {
    const gameId: string = req.params.id;
    const gameState: GameState = new GameState(gameId)
    const users: IUserReq[] | undefined = req.body.users;
    if (users) {
        users.forEach(user => gameState.AddPlayer({ userId: user.userId, username: user.username }));
    }
    gamesManager.createGame(gameState)
    res.status(200).send(`Game created with id: ${gameId}`)
}
const CreateGame = (req: Request, res: Response) => {
    const gameState: GameState = new GameState();
    const users: IUserReq[] | undefined = req.body.users;
    if (users) {
        users.forEach(user => gameState.AddPlayer({ userId: user.userId, username: user.username }));
    }
    gamesManager.createGame(gameState)
    res.status(200).send(`Game created with id: ${gameState.id}`)
}
const GetGames = (req: Request, res: Response) => {
    // res.status(200).send(gamesManager.getGameStates())
    res.status(200).send("Not implemented")
}
const GetGame = (req: Request, res: Response) => {
    const gameId: string = req.params.id;
    const gameState = gamesManager.getGame(gameId)
    if (!gameState) {
        return res.status(404).send("Game not found")
    }
    res.status(200).send(GameStateToJSON(gameState))
}
const GetGameFormated = (req: Request, res: Response) => {
    const gameId: string = req.params.id;
    const gameState = gamesManager.getGame(gameId)
    if (!gameState) {
        return res.status(404).send("Game not found")
    }
    res.status(200).send(GameStateToJSONFormated(gameState))
}
const GetOnlinePlayers = (req: Request, res: Response) => {
    if (gamesManager.socketsConnInfo.size <= 0) {
        return res.status(404).send('No players are online')
    }
    const arrayOfMaps: Array<Record<string, any>> = Array.from(gamesManager.socketsConnInfo.entries()).map(([socketId, playerInfo]) =>
        convertPlayerInfoToFormat(socketId, playerInfo)
    );
    res.status(200).send(arrayOfMaps)
}

function convertPlayerInfoToFormat(socketId: string, playerInfo: playerInfo): Record<string, any> {
    return {
        socket: socketId,
        playerInfo: {
            gameId: playerInfo.gameState.id,
            playerId: playerInfo.player.id,
        },
    };
}
export default {
    CreateGameWithId,
    CreateGame,
    GetGames,
    GetGame,
    GetGameFormated,
    GetOnlinePlayers
}