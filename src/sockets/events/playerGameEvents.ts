import { Socket } from "socket.io";
import { playerAction } from "../../types/Enums";
import { GetGameStateAndPlayer } from "../../services/helperFunctions";
import { GameState } from "../../core/GameState";
import { Player } from "../../core/Player";
import { cardActionsMap } from "../../constans/constans_cards";
import { cardOperationsMapping } from "../../core/cardActions/cardToActionsMap";
import { Hexagon } from "../../core/HexGrid";
import { axialCoordiantes } from "../../types/Types";
import { ICardOperationParams, IPlayerCardInput } from "../../types/Interfaces";
export function playerGameHandler(socket: Socket) {

    socket.on("player-card", ({ cardId, params }: IPlayerCardInput) => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        if (!player.isActive) {
            socket.emit("player-card-info", "PlayerCard: player is not active")
            return
        }
        if (!cardActionsMap.has(cardId)) {
            socket.emit("player-card-info", `PlayerCard: card id is not found, cardId: ${cardId}`)
            return
        }
        const res = cardOperationsMapping[(cardId)]
        const { Action } = res
        const actionParams: ICardOperationParams = {
            player: player,
            gameState: gameState,
            axial: params?.axial,
            targetPlayerId: params?.targetPlayerId,
            axialArray: params?.axialArray
        }
        try {
            Action(actionParams)
            gameState.deckManager.playCard(player, cardId)
        } catch (err) {
            socket.emit("player-card-info", `PlayerCard: Internal server error on card operation`)
            console.log(err)
        }
    })

    socket.on("player-card-variants", (cardId: string) => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        if (!cardActionsMap.has(cardId)) {
            socket.emit("player-card-variants-info", `playerCardVariants: card id is not found, cardId: ${cardId}`)
            return
        }
        const res = cardOperationsMapping[(cardId)]
        const { Info } = res
        const info: Hexagon[] | undefined = Info(gameState, player)
        socket.emit("player-card-variants-info", info)

    })
    socket.on("player-action-token", () => {

    })
    socket.on("player-action-pass", () => {

    })

}