import { GameState } from "../GameState"
import { Hexagon } from "../HexGrid"
import { Player } from "../Player"

export function SanctuaryActionInfo(gameState: GameState, player: Player): Hexagon[] | undefined {
    const hexArr: Hexagon[] | undefined = gameState.map.GetPlayerHex(player)
    if (!hexArr) {
        return undefined
    }
    return hexArr
}