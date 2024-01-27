import { Socket } from "socket.io";
import { GameState } from "../../core/gameState/GameState";
import { Player } from "../../core/Player";
import { string } from "joi";

export function chatEventsHandler(socket: Socket): void {
    socket.on("send-message", ({ message }: { message: string }) => {
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        try{
            gameState.chatManager.AddMessage(player, message);
            gameState.uiUpdater.EmitNewMessageUpdate(player)
        }catch(err){
            console.log(err);
        }
    })
    socket.on("mute-unmute", ({ targetPlayerId }: { targetPlayerId: string }) => {
        const gameState: GameState = socket.gameState!;
        const player: Player = socket.player!;
        const targetPlayer: Player | undefined = gameState.playerManager.GetPlayerById(targetPlayerId);
        try{
            if (!targetPlayer){
                throw new Error("Target player not found");
            }
            gameState.chatManager.MuteUnmutePlayer(player, targetPlayer);
        }catch(err){
            console.log(err);
        }
    })
}