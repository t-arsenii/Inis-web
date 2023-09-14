import { Socket } from "socket.io";
import { playerAction } from "../../types/Enums";
import { GetGameStateAndPlayer } from "../../services/helperFunctions";
interface IPlayerGame {
    gameId: string,
    cardId?:string | undefined,
    userId: string
    actionType: playerAction
}
export function playerGameHandler(socket: Socket) {
    socket.on("player-action", ({ actionType, gameId, userId, cardId }: IPlayerGame) => {
        const res = GetGameStateAndPlayer(socket, gameId, userId)
        if (res === undefined) {
            return
        }
        const { gameState, player } = res

        if(actionType === playerAction.Card)
        {
            if(!cardId){
                return
            }
        }
    })
}