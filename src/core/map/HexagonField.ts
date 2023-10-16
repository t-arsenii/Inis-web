import { getKeysWithMaxValue } from "../../services/helperFunctions"
import { axialCoordinates } from "../../types/Types"
import { GameState } from "../../gameState/GameState"
import { Player } from "../Player"

export class Field {
    territoryId: string = ""
    sanctuaryCount: number = 0
    citadelsCount: number = 0
    playersClans: Map<string, number> = new Map()
    leaderPlayerId: string | null = null
    gameState: GameState
    constructor(terId: string, gameState: GameState) {
        this.territoryId = terId
        this.gameState = gameState
    }
    toJSON() {
        const { territoryId, sanctuaryCount, citadelsCount, leaderPlayerId } = this
        const playerClans = Object.fromEntries(this.playersClans)
        return {
            territoryId,
            sanctuaryCount,
            citadelsCount,
            leaderPlayerId,
            playerClans
        }
    }
    UpdateLeader(): void {
        if (this.playersClans.size <= 0) {
            this.leaderPlayerId = null;
            return
        }
        //maybe unnecessary check
        if (!this.gameState.brenPlayer) {
            throw new Error("")
        }

        if (this.playersClans.size === 1) {
            const [singleKey] = this.playersClans.keys();
            this.leaderPlayerId = singleKey;
            return;
        }
        const maxClansPlayersKeys: string[] = getKeysWithMaxValue(this.playersClans);
        if (maxClansPlayersKeys.length === 1) {
            this.leaderPlayerId = maxClansPlayersKeys[0]
            return
        }
        if (maxClansPlayersKeys.includes(this.gameState.brenPlayer.id)) {
            this.leaderPlayerId = this.gameState.brenPlayer.id
            return
        }
        this.leaderPlayerId = null;
    }
    hasClans(player: Player): boolean {
        return this.playersClans.has(player.id)
    }
}
export class Hexagon {
    public q: number
    public r: number
    public field: Field
    constructor(axial: axialCoordinates, field: Field) {
        this.q = axial.q
        this.r = axial.r
        this.field = field
    }
}