import { Player } from "../core/Player";
import { TurnOrder } from "../core/GameState";
import { axialCoordiantes } from "../types/Types";
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
        if (!player.Socket) {
            return false;
        }
    }
    return true
}
export function GetRandomOrder(): TurnOrder {
    const randomValue = Math.random();
    if (randomValue < 0.5) {
        return TurnOrder.clockwise;
    } else {
        return TurnOrder.counter_clockwise;
    }
}

export function AxialToString(axial:axialCoordiantes):string {
    return `${axial.q},${axial.r}`
}