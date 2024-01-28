import { GameState } from "../gameState/GameState";
import { HexGridManager } from "./HexGridManager";

export class SetupController {
    private setupClansCounter;
    private _hexGrid: HexGridManager;
    constructor(hexGrid: HexGridManager) {
        this._hexGrid = hexGrid;
        this.setupClansCounter = 0;
    }
    public SetupClans(): boolean {
        const numPlayers = this._hexGrid._gameState.playerManager.numPlayers;
        this.setupClansCounter++;
        if (this.setupClansCounter === numPlayers * 2) {
            return true;
        }
        return false;
    }
    public SkipSetupClans(): void {
        this.setupClansCounter = this._hexGrid._gameState.playerManager.numPlayers * 2;
    }
}