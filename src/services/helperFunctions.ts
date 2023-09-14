import { Player } from "../core/Player";
import { GameState } from "../core/GameState";
import { axialCoordiantes } from "../types/Types";
import { Socket } from "socket.io";
import { gamesManager } from "../core/GameStateManager";
import { TurnOrder } from "../types/Enums";
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

export function CheckSocketGameConnection(socket:Socket, gameId:string):boolean{
    if (!gamesManager.socketToGame.has(socket.id)) {
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