import { Socket } from "socket.io";
import { playerAction } from "../../types/Enums";
import { GetGameStateAndPlayer } from "../../services/helperFunctions";
import { GameState } from "../../core/GameState";
import { Player } from "../../core/Player";
import { cardActionMap } from "../../constans/constant_action_cards";
import { cardEposMap } from "../../core/cardOperations/cardMap";
import { Hexagon } from "../../core/HexGrid";
import { axialCoordiantes } from "../../types/Types";
import { ICardOperationParams, ICardOperationResponse, IPlayerCardInput } from "../../types/Interfaces";
export function playerCardHandler(socket: Socket) {
    socket.on("player-card-season", ({ cardId, params }: IPlayerCardInput) => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        if (!player.isActive) {
            socket.emit("player-card-season-error", "PlayerCardSeason: player is not active")
            return
        }
        if (!cardActionMap.has(cardId)) {
            socket.emit("player-card-season-error", `PlayerCardSeason: card id is not found, cardId: ${cardId}`)
            return
        }
        if (!gameState.deckManager.PlayerHasCard(player, cardId)) {
            socket.emit("player-card-season-error", `PlayerCardSeason: player dosen't have a card with id: ${cardId}`)
            return
        }
        const res = cardEposMap[(cardId)]
        const { Action } = res
        const actionParams: ICardOperationParams = {
            player: player,
            gameState: gameState,
            axial: params?.axial,
            targetPlayerId: params?.targetPlayerId,
            targetCardId: params?.targetCardId,
            axialToNum: params?.axialToNum
        }
        try {
            Action(actionParams)
            gameState.deckManager.PlayCard(player, cardId)
        } catch (err) {
            socket.emit("player-card-season-error", `PlayerCardSeasob: Internal server error on card operation:\n${err}`)
            console.log(err)
        }
    })
    socket.on("player-card-info", ({ cardId, params }: IPlayerCardInput) => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        if (!cardActionMap.has(cardId)) {
            socket.emit("player-card-info-error", `playerCardVariants: card id is not found, cardId: ${cardId}`)
            return
        }
        const infoParams: ICardOperationParams = {
            player: player,
            gameState: gameState,
            axial: params?.axial,
            targetPlayerId: params?.targetPlayerId,
            targetCardId: params?.targetCardId,
            axialToNum: params?.axialToNum
        }
        const res = cardEposMap[(cardId)]
        const { Info } = res
        const info: ICardOperationResponse = Info(infoParams)
        socket.emit("player-card-info", info)

    })
    socket.on("player-card-trixel",()=>{

    })
    socket.on("player-token", () => {

    })
    socket.on("player-pass", () => {

    })
}