import axios from "axios";
import { GameState } from "../core/gameState/GameState";
import { IGameDataOutput } from "../types/Interfaces";

async function sendDatatToGameService(gameState: GameState) {
    const body: IGameDataOutput = {
        duration: 69,
        rounds: gameState.gameStats.roundCounter,
        numberOfPlayers: gameState.playerManager.players.size,
        players: gameState.playerManager.GetPlayers().map(player => player.id),
        gameSpeed: gameState.gameStats.gameSpeed,
        ranked: gameState.gameStats.ranked,
        winner: gameState.gameStats.winner!
    };
    const res = await axios.post("http://localhost:4444", body);
    console.log(res);
}
export { sendDatatToGameService }