import { GameState } from "../gameState/GameState";

export class SetupController {
    private gameState: GameState;
    private setupClansCounter;
    constructor(gameState: GameState) {
        this.gameState = gameState
        this.setupClansCounter = 0;
    }
    public SetupClans(): boolean {
        const numPlayers = this.gameState.playerManager.numPlayers;
        this.setupClansCounter++;
        if (this.setupClansCounter === numPlayers * 2) {
            return true
        }
        return false
    }
    public SkipSetupClans(): void {
        this.setupClansCounter = this.gameState.playerManager.numPlayers * 2
    }
}