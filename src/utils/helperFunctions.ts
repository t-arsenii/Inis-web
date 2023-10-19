import { Player } from "../core/Player";
import { axialCoordinates } from "../types/Types";
import { Socket } from "socket.io";
import { TurnOrder } from "../types/Enums";
import { Hexagon } from "../core/map/HexagonField";
import { GameState } from "../core/gameState/GameState";
import { gamesManager } from "../core/gameState/GameStateManager";

export function shuffle<T>(array: T[]): T[] {
    const shuffledArray = array.slice(); // Copy the original array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}
export function checkSockets(playersMap: Map<string, Player>): boolean {
    const players: Player[] = Array.from(playersMap.values())
    for (const player of players) {
        if (!player.socket) {
            return false;
        }
    }
    return true
}
export function getRandomDirection(): TurnOrder {
    const randomValue = Math.random();
    if (randomValue < 0.5) {
        return TurnOrder.clockwise;
    } else {
        return TurnOrder.counter_clockwise;
    }
}

export function AxialToString(axial: axialCoordinates): string {
    return `${axial.q},${axial.r}`
}

export function hexToAxialCoordinates(hex: Hexagon): axialCoordinates {
    return { q: hex.q, r: hex.r }
}

export function CheckSocketGameConnection(socket: Socket, gameId: string): boolean {
    if (!gamesManager.socketsConnInfo.has(socket.id)) {
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
export function getKeyWithUniqueMaxValue(map: Map<string, number>) {
    let maxKey = null;
    let maxValue = -Infinity;
    let isUnique = true;
    for (const [key, value] of Object.entries(map)) {
        if (value > maxValue) {
            maxKey = key;
            maxValue = value;
            isUnique = true; // Reset isUnique when a new maximum value is found
        } else if (value === maxValue) {
            isUnique = false; // There is another key with the same maximum value
        }
    }
    return isUnique ? maxKey : null;
}
export function getKeysWithMaxValue(map: Map<string, number>) {
    let maxKeys: string[] = [];
    let maxValue = -Infinity;
    map.forEach((value, key) => {
        if (value > maxValue) {
            maxKeys = [key];
            maxValue = value;
        } else if (value === maxValue) {
            maxKeys.push(key);
        }
    })
    return maxKeys;
}