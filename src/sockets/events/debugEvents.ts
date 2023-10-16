import { Socket } from "socket.io";
import { GameState } from "../../gameState/GameState";
import { Player } from "../../core/Player";
import { GameStage } from "../../types/Enums";
import { IPlayerCardInput } from "../../types/Interfaces";
import { axialCoordinates } from "../../types/Types";
import { HexGridToJson } from "../../services/HexGridService";
import { gamesManager } from "../../gameState/GameStateManager";

export function DebugTools(socket: Socket) {
    socket.on("get-fight-info", () => {
        const gameState: GameState = socket.gameState!
        // console.log(gameState.fightManager.currentFight)
        socket.emit("fight-info", gameState.fightManager.currentFight)
    })
    socket.on("init-fight", () => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        gameState.fightManager.InitFight(player, gameState.map.GetHex({ q: 0, r: 0 })!)
    })
    socket.on("move", ({ axialFrom, axialTo, clansNum }: { axialFrom: axialCoordinates, axialTo: axialCoordinates, clansNum: number }) => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        try {
            gameState.map.clansController.MoveClans(player, axialFrom, axialTo, clansNum)
        } catch (err) {
            console.log(err)
        }
    })
    socket.on("territory-all", () => {
        const gameState: GameState = socket.gameState!
        socket.emit("territory-info", HexGridToJson(gameState.map))
    })
    socket.on("territory-avaliable", () => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        socket.emit("territory-info", gameState?.map.GetAllValidPlacements())
    })
    socket.on("next-turn", () => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        if (gameState.turnOrder.activePlayerId !== player.id) {
            return
        }
        gameState.NextTurn()
        socket.emit("next-turn", gameState.turnOrder)
    })
    socket.on("get-deal-cards", () => {
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        socket.emit("get-deal-cards", gameState.deckManager.dealCards);
    })
}