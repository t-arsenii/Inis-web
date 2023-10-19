import { GameState } from "../gameState/GameState";

export class SetupController {
    private gameState: GameState
    constructor(gameState: GameState) {
        this.gameState = gameState
    }
    private setupClansCounter = 0
    public SetupClans(): boolean {
        this.setupClansCounter++
        if (this.setupClansCounter === this.gameState.numPlayers * 2) {
            return true
        }
        return false
    }
    public SkipSetupClans(): void {
        this.setupClansCounter = this.gameState.numPlayers * 2
    }
}