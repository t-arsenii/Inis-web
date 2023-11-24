import { Player } from "../core/Player";
import { GameState } from "../core/gameState/GameState";

function startTimerAndListen(gameState: GameState, timeoutMs: number, eventName: string, callback: () => void) {
    const timer = setTimeout(() => {
        console.log("Action is not occurred")
        callback();
    }, timeoutMs);

    gameState.eventEmitter.on(eventName, (player: Player) => {
        clearTimeout(timer);
        console.log("Action occurred.");
    });
}
export { startTimerAndListen };