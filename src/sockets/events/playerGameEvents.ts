import { Server, Socket } from "socket.io";
import { Player } from "../../core/Player";
import { cardActionMap } from "../../core/constans/constant_action_cards";
import { cardSeasonMap, cardTrixelMap } from "../../core/cardOperations/cardMap";
import { ICardOperationParams, ICardOperationResponse, IPretenderTokenInput, IPlayerCardDealInput, IPlayerCardInput } from "../../types/Interfaces";
import { trixelCondition_oOWJ5 } from "../../core/constans/constant_trixelConditions";
import { GameStage, playerAction } from "../../types/Enums";
import { GameState } from "../../core/gameState/GameState";
import { cardAllMap } from "../../core/constans/constant_all_cards";
import { checkAllPlayersPass } from "../../utils/gameStateUtils";
export function playerCardHandler(io: Server, socket: Socket) {
    socket.on("player-card-season", ({ cardId, params }: IPlayerCardInput) => {
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        try {
            if (!player.isActive) {
                throw new Error("PlayerCardSeason: player is not active");
            }
            if (gameState.gameStage !== GameStage.Season) {
                throw new Error("PlayerCardSeason: Game stage is not Season");
            }
            //Check card in seasonMap
            if (!cardActionMap.has(cardId)) {
                throw new Error(`PlayerCardSeason: card id is not found, cardId: ${cardId}`);
            }
            if (!gameState.deckManager.PlayerHasCard(player, cardId)) {
                throw new Error(`PlayerCardSeason: player dosen't have a card with id: ${cardId}`);
            }
            const res = cardSeasonMap[cardId]
            const { Action } = res
            const actionParams: ICardOperationParams = {
                player: player,
                gameState: gameState,
                ...params
            }
            Action(actionParams);
            gameState.deckManager.DiscardCard(player, cardId);
            gameState.trixelManager.AddTrixel(player, trixelCondition_oOWJ5);
            player.lastAction = playerAction.Card;
        } catch (err) {
            socket.emit("player-card-season-error", `PlayerCardSeasob: Internal server error on card operation:\n${err}`);
            console.log(err);
            return;
        }
        io.to(gameState.id).emit("map-update", gameState.uiUpdater.getMapUiInfo());
        io.to(gameState.id).emit("my-deck-update", gameState.uiUpdater.getMyDeckUiInfo(player));
        io.to(gameState.id).emit("sidebar-update", gameState.uiUpdater.getSidebarUiInfo());
        io.to(gameState.id).emit("game-update", gameState.uiUpdater.getGameUiInfo());
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
        try {
            if (!cardAllMap.has(cardId)) {
                throw new Error(`PlayerCardTrixel: card id is not found, cardId: ${cardId}`)
            }
            if (!gameState.deckManager.PlayerHasCard(player, cardId)) {
                throw new Error(`PlayerCardTrixel: player dosen't have a card with id: ${cardId}`)
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
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        try {
            if (!player.isActive) {
                throw new Error("PlayerToken: player is not active");
            }
            if (gameState.gameStage !== GameStage.Season) {
                throw new Error("PlayerToken: Game stage is not Season");
            }
            gameState.TakePretenderToken(player, type);
            gameState.turnOrderManager.NextTurn();
            player.lastAction = playerAction.Token;
        } catch (err) {
            socket.emit("player-token-error", `PlayerToken: Internal server error on card operation:\n${err}`);
            console.log(err);
        }
        io.to(gameState.id).emit("sidebar-update", gameState.uiUpdater.getSidebarUiInfo());
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
            gameState.turnOrderManager.NextTurn();
            player.lastAction = playerAction.Pass;
            if (checkAllPlayersPass(gameState.playerManager.GetPlayers())) {
                gameState.EndSeasonStage();
                gameState.StartGatheringStage();
                io.to(gameState.id).emit("game-update", gameState.uiUpdater.getGameUiInfo());
            }
        } catch (err) {
            console.log(err)
        }
        io.to(gameState.id).emit("sidebar-update", gameState.uiUpdater.getSidebarUiInfo());
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
        catch (err) {
            console.log(err);
        }
    })
}