import { trixelCondition_bxaty } from "../../constans/constant_trixelConditions";
import { ICardOperationParams } from "../../types/Interfaces";

export function BardTrixel({ gameState, player }: ICardOperationParams) {
    if (!gameState.trixelManager.HasTrixel(player, trixelCondition_bxaty)) {
        throw new Error("BardTrixel: player dosen't have condition to play trixel")
    }
    
}