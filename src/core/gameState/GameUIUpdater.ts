import { IAttackCycleUiInfo, ICardOperationParams, ICardOperationResponse, IDealCardsInfo, IFightUiInfo, IGameUiInfo, IMapUiInfo, IMeUiInfo, IMyDeckUiInfo, IPlayersUiInfo, IPretenderToken, ISidebarUiInfo } from "../../types/Interfaces";
import { axialCoordinates } from "../../types/Types";
import { PretenderClans, PretenderSanctuaries, PretenderTerritories } from "../../utils/gameStateUtils";
import { hexToAxialCoordinates } from "../../utils/helperFunctions";
import { Player } from "../Player";
import { MIN_WINNING_AMOUNT } from "../constans/constant_3_players";
import { territoryMap } from "../constans/constant_territories";
import { GameState } from "./GameState";
import { io } from "../../initServer";
import { GameStage } from "../../types/Enums";
export class GameUiUpdater {
    _gameState: GameState;
    constructor(gameState: GameState) {
        this._gameState = gameState;
    }
    public EmitGameUpdate() {
        io.to(this._gameState.id).emit("game-update", this.getGameUiInfo());
    }
    public EmitMyDeckUpdate(player: Player) {
        if (!player.socket) {
            throw new Error("GameUiUpdater error");
        }
        player.socket.emit("my-deck-update", this.getMyDeckUiInfo(player));
    }
    public EmitMapUpdate() {
        io.to(this._gameState.id).emit("map-update", this.getMapUiInfo());
    }
    public EmitSidebarUpdate() {
        io.to(this._gameState.id).emit("sidebar-update", this.getSidebarUiInfo());
    }
    public EmitDealCardUpdate(player: Player) {
        if (!player.socket) {
            throw new Error("GameUiUpdater error");
        }
        player.socket!.emit("dealCards-update", this.getDealCardUiInfo(player));
    }
    public EmitMeInfoUpdate(player: Player) {
        if (!player.socket) {
            throw new Error("GameUiUpdater error");
        }
        player.socket!.emit("me-info", this.getMeUiInfo(player));
    }
    public EmitAllPlayersInfoUpdate(player: Player) {
        if (!player.socket) {
            throw new Error("GameUiUpdater error");
        }
        player.socket!.emit("allPlayers-info", this.getAllPlayerUiInfo());
    }
    public EmitPretenderTokenUpdate(player: Player) {
        if (!player.socket) {
            throw new Error("GameUiUpdater error");
        }
        io.to(player.socket.id).emit("token-update", this.getPretenderTokenInfo(player));
    }
    public EmitFightUpdate() {
        io.to(this._gameState.id).emit("fight-update", this.getFightUiInfo());
    }
    public EmitAttackCycleUpdate() {
        io.to(this._gameState.id).emit("attackCycle-update", this.getAttackCycleUiInfo());
    }
    public EmitMyDeckUpdateAll() {
        const players = this._gameState.playerManager.GetPlayers();
        for (const _player of players) {
            if (!_player.socket) {
                throw new Error("GameUiUpdater error");
            }
            _player.socket!.emit("my-deck-update", this.getMyDeckUiInfo(_player));
        }
    }
    public EmitDealCardUpdateAll() {
        const players = this._gameState.playerManager.GetPlayers();
        for (const _player of players) {
            if (!_player.socket) {
                throw new Error("GameUiUpdater error");
            }
            _player.socket!.emit("dealCards-update", this.getDealCardUiInfo(_player));
        }
    }
    public EmitAllMessagesUpdate(player: Player) {
        if (!player.socket) {
            throw new Error("GameUiUpdater error");
        }
        player.socket.emit("all-messages", this._gameState.chatManager.GetMessages())
    }
    public EmitNewMessageUpdate(player: Player) {
        if (!player.socket) {
            throw new Error("GameUiUpdater error");
        }
        const players = this._gameState.playerManager.GetPlayers();
        for (const _player of players) {
            if (!_player.socket) {
                throw new Error("GameUiUpdater error");
            }
            const playerMutedPlayers = this._gameState.chatManager.GetPlayerMutedPlayerIds(_player);
            if (!playerMutedPlayers.includes(player.id)) {
                _player.socket.emit("new-message", this._gameState.chatManager.GetLastMessage());
            }
        }
    }
    public EmitIsActiveUpdate() {
        const players = this._gameState.playerManager.GetPlayers();
        for (const _player of players) {
            if (!_player.socket) {
                continue;
            }
            const activePlayerId = this._gameState.turnOrderManager.GetActivePlayer().id;
            _player.socket!.emit("is-active", { isActive: activePlayerId === _player.id });
        }
    }
    public EmitPlayerFightMoveUpdate(player: Player) {
        if (this._gameState.gameStage !== GameStage.Fight) {
            throw new Error("player-move-info: Game Stage is not fight");
        }
        const fightHex = this._gameState.fightManager.currentFight?.fightHex!;
        const neighbourHexArr = this._gameState.hexGridManager.GetNeighbors(fightHex);
        const resHexArr = [];
        for (const _hex of neighbourHexArr) {
            if (_hex.field.leaderPlayerId === player.id) {
                resHexArr.push(_hex);
            }
        }
        const clansCount = fightHex.field.playersClans.get(player.id)!;
        const res: ICardOperationResponse = {
            axial: resHexArr,
            maxTerClicks: clansCount
        };
        player.socket?.emit("player-move-info", res);
    }
    private getMapUiInfo(): IMapUiInfo {
        const hexGrid = this._gameState.hexGridManager;
        let capitalCoordinates: axialCoordinates | null = null
        if (hexGrid.fieldsController.capitalHex) {
            capitalCoordinates = hexToAxialCoordinates(hexGrid.fieldsController.capitalHex);
        }
        let holidayCoordinates: axialCoordinates | null = null
        if (hexGrid.fieldsController.festivalHex) {
            holidayCoordinates = hexToAxialCoordinates(hexGrid.fieldsController.festivalHex);
        }
        const terLeft = hexGrid.fieldsController.avalibleTerritories.length;
        return {
            capital: capitalCoordinates,
            holiday: holidayCoordinates,
            hexGrid: Array.from(hexGrid.hexGrid.values()).map(hex => ({ q: hex.q, r: hex.r, field: hex.field })),
            terLeft: terLeft
        };
    }
    private getMyDeckUiInfo(player: Player): IMyDeckUiInfo {
        const deck = this._gameState.deckManager.getPlayerDeck(player);
        if (!deck) {
            return {
                ActionCards: [],
                EposCards: [],
                AdvantagesCards: []
            };
        }
        return {
            ActionCards: deck.actionCards,
            EposCards: deck.eposCards,
            AdvantagesCards: deck.advantagesCards
        };
    }
    private getSidebarUiInfo(): ISidebarUiInfo {
        const players = this._gameState.playerManager.GetPlayers();
        const sidebarUiInfo: ISidebarUiInfo = { players: [], turnDirection: this._gameState.turnOrderManager.GetDirection() };
        const playerIdsInOrder = this._gameState.turnOrderManager.GetPlayerIdsInOrder();

        const playersById: Record<string, Player> = {};
        players.forEach(player => {
            playersById[player.id] = player;
        });

        playerIdsInOrder.forEach(playerId => {
            const player = playersById[playerId];
            if (player) {
                const deck = this._gameState.deckManager.getPlayerDeck(player)!;
                const pretenderTokens = Object.values(player.pretenderTokens).filter(value => value === true).length;
                sidebarUiInfo.players.push({
                    id: player.id,
                    username: player.username,
                    mmr: player.mmr,
                    color: player.color,
                    deck: {
                        Epos: deck.eposCards.length,
                        Action: deck.actionCards.length,
                        Advantage: deck.advantagesCards.length
                    },
                    clans: player.clansLeft,
                    tokens: {
                        deed: player.deedTokens,
                        pretender: pretenderTokens
                    },
                    isBren: player.isBren,
                    isActive: player.isActive,
                    lastAction: player.lastAction
                })
            }
        });
        return sidebarUiInfo;
    }
    private getGameUiInfo(): IGameUiInfo {
        return {
            gameStatus: this._gameState.gameStatus,
            maxPlayers: this._gameState.playerManager.numPlayers,
            citadelsLeft: this._gameState.hexGridManager.fieldsController.citadelsLeft,
            sanctuariesLeft: this._gameState.hexGridManager.fieldsController.sanctuariesLeft,
            gameStage: this._gameState.isPaused ? GameStage.PAUSE : this._gameState.gameStage
        }
    }
    private getDealCardUiInfo(player: Player): IDealCardsInfo {
        if (!this._gameState.deckManager.dealCards) {
            throw new Error("No cards to discard");
        }
        const dealCards = { ...this._gameState.deckManager.dealCards };
        if (!dealCards.players || !dealCards.players.hasOwnProperty(player.id)) {
            throw new Error("Player not found in deal cards");
        }
        const cardIds = dealCards.players[player.id].cards;
        return {
            cardsToDiscardNum: dealCards.cardsToDiscardNum,
            cardIds: cardIds
        }
    }
    private getFightUiInfo(): IFightUiInfo {
        if (!this._gameState.fightManager.currentFight) {
            throw new Error("No active fight");
        }
        const players = this._gameState.fightManager.currentFight.players;
        const activePlayerId = this._gameState.fightManager.currentFight.FightTurnOrder.activePlayerId;
        const _players = Object.keys(players).map((playerId) => ({
            username: this._gameState.playerManager.GetPlayerById(playerId)!.username,
            playerId,
            clansNum: players[playerId].clansNum,
            peace: players[playerId].peace,
            isActive: playerId === activePlayerId
        }));
        const axialHexFight = hexToAxialCoordinates(this._gameState.fightManager.currentFight.fightHex);
        return {
            fightHex: axialHexFight,
            players: _players
        }
    }
    private getAttackCycleUiInfo(): IAttackCycleUiInfo {
        if (!this._gameState.fightManager.currentFight) {
            throw new Error("No active fight");
        }
        const currentFight = this._gameState.fightManager.currentFight;
        if (!currentFight.attackCycle) {
            return {
                status: false,
                attackerPlayerId: null,
                defenderPlayerId: null
            }
        }
        return currentFight.attackCycle;
    }
    private getMeUiInfo(player: Player): IMeUiInfo {
        return {
            id: player.id,
            username: player.username,
            mmr: player.mmr,
            color: player.color
        }
    }
    private getAllPlayerUiInfo(): IPlayersUiInfo {
        const players = this._gameState.playerManager.GetPlayers();
        let playerUiInfo: IPlayersUiInfo = { players: [] }
        players.forEach(player => {
            playerUiInfo.players.push({
                id: player.id,
                username: player.username,
                mmr: player.mmr,
                color: player.color
            })
        })
        return playerUiInfo;
    }
    private getPretenderTokenInfo(player: Player): IPretenderToken {
        const winning_amount = MIN_WINNING_AMOUNT - player.deedTokens;

        const isSanctuariesPretender = PretenderSanctuaries(this._gameState, player, winning_amount);
        const isClansPretender = PretenderClans(this._gameState, player, winning_amount);
        const isTerritoriesPretender = PretenderTerritories(this._gameState, player, winning_amount);
        return {
            sanctuaries: isSanctuariesPretender,
            clans: isClansPretender,
            territories: isTerritoriesPretender
        }
    }
}