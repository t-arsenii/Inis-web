import express, { Request, Response } from "express"
import { GameState } from "../core/gameState/GameState";
import { playerInfo } from "../types/Types";
import { GameStateToJSON, GameStateToJSONFormated } from "../utils/gameStateUtils";
import { gamesManager } from "../core/gameState/GameStateManager";
import { ICreateGameDto, IPlayer } from "../types/Interfaces";
import { playerSchema } from "../schemas/playerSchema";
import { gameSchema } from "../schemas/gameSchema";

const CreateGameWithId = (req: Request, res: Response) => {
    const gameId: string = req.params.id;
    const data: ICreateGameDto = req.body;
    const { error } = gameSchema.validate(data);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    if (data.players.length != data.settings.numberOfPlayers) {
        return res.status(500).send("Number of player error");
    }
    const gameState: GameState = new GameState(gameId);
    const players: IPlayer[] = data.players;
    gameState.playerManager.SetNumberOfPlayers(data.settings.numberOfPlayers);
    players.forEach(player => gameState.playerManager.AddPlayer({ id: player.id, username: player.username, mmr: player.mmr }));
    gamesManager.createGame(gameState)
    res.status(200).send(`Game created with id: ${gameState.id}`)
}
const CreateGame = (req: Request, res: Response) => {
    const data: ICreateGameDto = req.body;
    const { error } = gameSchema.validate(data);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    if (data.players.length != data.settings.numberOfPlayers) {
        return res.status(500).send("Number of player error");
    }
    const gameState: GameState = new GameState();
    const players: IPlayer[] = data.players;
    gameState.playerManager.SetNumberOfPlayers(data.settings.numberOfPlayers);
    players.forEach(player => gameState.playerManager.AddPlayer({ id: player.id, username: player.username, mmr: player.mmr }));
    gamesManager.createGame(gameState)
    res.status(200).send(`Game created with id: ${gameState.id}`)
}
const GetGames = (req: Request, res: Response) => {
    // res.status(200).send(gamesManager.getGameStates())
    res.status(200).send("Not implemented")
}
const GetGame = (req: Request, res: Response) => {
    const gameId: string = req.params.id;
    const gameState = gamesManager.getGame(gameId);
    if (!gameState) {
        return res.status(404).send("Game not found");
    }
    res.status(200).send(GameStateToJSON(gameState));
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