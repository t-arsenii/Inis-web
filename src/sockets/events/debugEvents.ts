import { Server, Socket } from "socket.io";
import { Player } from "../../core/Player";
import { GameStage } from "../../types/Enums";
import { IPlayerCardInput } from "../../types/Interfaces";
import { axialCoordinates } from "../../types/Types";
import { HexGridToJson } from "../../utils/HexGridUtils";
import { GameState } from "../../core/gameState/GameState";
import { gamesManager } from "../../core/gameState/GameStateManager";

export function DebugTools(io: Server, socket: Socket) {
    socket.on("get-fight-info", () => {
        const gameState: GameState = socket.gameState!
        // console.log(gameState.fightManager.currentFight)
        socket.emit("fight-info", gameState.fightManager.currentFight)
    })
    socket.on("init-fight", () => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        gameState.fightManager.InitFight(player, gameState.hexGridManager.GetHex({ q: 0, r: 0 })!)
    })
    socket.on("move", ({ axialFrom, axialTo, clansNum }: { axialFrom: axialCoordinates, axialTo: axialCoordinates, clansNum: number }) => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        try {
            gameState.hexGridManager.clansController.MoveClans(player, axialFrom, axialTo, clansNum)
        } catch (err) {
            console.log(err)
        }
    })
    socket.on("territory-all", () => {
        const gameState: GameState = socket.gameState!;
        socket.emit("territory-info", HexGridToJson(gameState.hexGridManager));
        console.log("Territory all event!");
    })
    socket.on("territory-avaliable", () => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        socket.emit("territory-info", gameState?.hexGridManager.GetAllValidPlacements())
    })
    socket.on("next-turn", () => {
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        if (gameState.turnOrderManager.GetActivePlayer()!.id !== player.id) {
            return;
        }
        gameState.turnOrderManager.NextTurn();
        socket.emit("next-turn", gameState.turnOrderManager.turnOrder);
    })
    socket.on("get-deal-cards", () => {
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        socket.emit("get-deal-cards", gameState.deckManager.dealCards);
    })
    socket.on("game-init", (gameId) => {
        const gameState: GameState | undefined = gamesManager.getGame(gameId);
        if (!gameState) {
            return
        }
        try {
            gameState.Init()
        }
        catch (err) {
            console.log(err)
            return
        }
        socket.emit("gameLobby-info", `game with id ${gameState.id} was initialized`)
    })
}