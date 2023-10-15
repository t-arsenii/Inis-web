import { Socket } from "socket.io";
import { GameState } from "../../core/GameState";
import { Player } from "../../core/Player";
import { cardActionMap } from "../../core/constans/constant_action_cards";
import { cardSeasonMap, cardTrixelMap } from "../../core/cardOperations/cardMap";
import { ICardOperationParams, ICardOperationResponse, IPretenderTokenInput, IPlayerCardDealInput, IPlayerCardInput } from "../../types/Interfaces";
import { trixelCondition_oOWJ5 } from "../../core/constans/constant_trixelConditions";
import { GameStage, playerAction } from "../../types/Enums";
export function playerCardHandler(socket: Socket) {
    socket.on("player-card-season", ({ cardId, params }: IPlayerCardInput) => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        try {
            if (!player.isActive) {
                throw new Error("PlayerCardSeason: player is not active")
            }
            if (gameState.gameStage !== GameStage.Season) {
                throw new Error("PlayerCardSeason: Game stage is not Season");
            }
            //Check card in seasonMap
            if (!cardActionMap.has(cardId)) {
                throw new Error(`PlayerCardSeason: card id is not found, cardId: ${cardId}`)
            }
            if (!gameState.deckManager.PlayerHasCard(player, cardId)) {
                throw new Error(`PlayerCardSeason: player dosen't have a card with id: ${cardId}`)
            }
            const res = cardSeasonMap[(cardId)]
            const { Action } = res
            const actionParams: ICardOperationParams = {
                player: player,
                gameState: gameState,
                ...params
            }
            Action(actionParams)
            gameState.deckManager.DiscardCard(player, cardId)
            gameState.trixelManager.AddTrixel(player, trixelCondition_oOWJ5)
            player.lastAction = playerAction.Card
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
            ...params
        }
        const res = cardSeasonMap[(cardId)]
        const { Info } = res
        const info: ICardOperationResponse = Info(infoParams)
        socket.emit("player-card-info", info)

    })
    socket.on("player-card-trixel", ({ cardId, params }: IPlayerCardInput) => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        //Check card in trixelMap
        // if (!cardActionMap.has(cardId)) {
        //     socket.emit("player-card-season-error", `PlayerCardSeason: card id is not found, cardId: ${cardId}`)
        //     return
        // }
        try {
            if (!gameState.deckManager.PlayerHasCard(player, cardId)) {
                throw new Error(`PlayerCardSeason: player dosen't have a card with id: ${cardId}`)
            }
            const res = cardTrixelMap[(cardId)]
            const { Action } = res
            const actionParams: ICardOperationParams = {
                player: player,
                gameState: gameState,
                ...params
            }
            Action(actionParams)
            gameState.deckManager.DiscardCard(player, cardId)
        } catch (err) {
            socket.emit("player-card-trixel-error", `PlayerCardSeasob: Internal server error on card operation:\n${err}`)
            console.log(err)
        }
    })
    socket.on("player-token", ({ type }: IPretenderTokenInput) => {
        const gameState: GameState = socket.gameState!
        const player: Player = socket.player!
        try {
            if (!player.isActive) {
                throw new Error("PlayerToken: player is not active")
            }
            if (gameState.gameStage !== GameStage.Season) {
                throw new Error("PlayerToken: Game stage is not Season");
            }
            gameState.TakePretenderToken(player, type)
            gameState.NextTurn()
            player.lastAction = playerAction.Token
        } catch (err) {
            socket.emit("player-token-error", `PlayerToken: Internal server error on card operation:\n${err}`)
            console.log(err)
        }
    })
    //potential bugs when player make moves and then pass, because he's in active whole time
    socket.on("player-pass", () => {
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        try {
            if (!player.isActive) {
                throw new Error("PlayerPass: player is not active")
            }
            if (gameState.gameStage !== GameStage.Season) {
                throw new Error("PlayerPass: Game stage is not Season");
            }
            gameState.NextTurn();
            player.lastAction = playerAction.Pass;
            gameState.TryEndRound();
        } catch (err) {
            console.log(err)
        }
    })
    socket.on('player-card-deal', ({ cardIds }: IPlayerCardDealInput) => {
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        try {
            if (gameState.gameStage !== GameStage.Gathering) {
                throw new Error("");
            }
            gameState.deckManager.PlayerDealActionCardDiscard(player, cardIds);
            gameState.deckManager.TryDealActionCards();
            gameState.deckManager.TryEndDealActionCards();
        }
        catch(err){
            console.log(err);
        }
    })
}