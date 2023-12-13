import { IMessage } from "../types/Interfaces";
import { Player } from "./Player";
import { GameState } from "./gameState/GameState";

export class ChatManager {
    private _gameState: GameState;
    messages: IMessage[];
    mutedPlayers: Map<string, Set<string>>;
    constructor(gameState: GameState) {
        this._gameState = gameState;
        this.messages = [];
        this.mutedPlayers = new Map();
    }
    public Init() {
        const players = this._gameState.playerManager.GetPlayers();
        for (const _player of players) {
            this.mutedPlayers.set(_player.id, new Set());
        }
    }
    public AddMessage(player: Player, messageText: string): void {
        const message: IMessage = {
            userId: player.id,
            username: player.username,
            message: messageText
        }
        this.messages.push(message);
    }
    public MuteUnmutePlayer(player: Player, targetPlayer: Player): void {
        if (!this.mutedPlayers.has(player.id)) {
            throw new Error("Chat: mute player error");
        }
        const playerMutedPlayers = this.mutedPlayers.get(player.id);
        if (playerMutedPlayers?.has(targetPlayer.id)) {
            playerMutedPlayers.delete(targetPlayer.id);
            return;
        }
        playerMutedPlayers?.add(targetPlayer.id);

    }
    public GetMessages(): IMessage[] {
        return this.messages;
    }
    public GetLastMessage(): IMessage {
        return this.messages[this.messages.length - 1];
    }
    public GetPlayerMutedPlayerIds(player: Player): string[] {
        if (!this.mutedPlayers.has(player.id)) {
            throw new Error("Chat: GetPlayerMutedPlayerIds error");
        }
        const playerMutedPlayer = this.mutedPlayers.get(player.id);
        if (!playerMutedPlayer) {
            throw new Error("Chat: GetPlayerMutedPlayerIds error");
        }
        return Array.from(playerMutedPlayer);
    }
}