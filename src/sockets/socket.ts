import { Server, Socket } from "socket.io";
import { gamesManager } from "../models/GameStateManager";
import { Player } from "../models/Player";
import { cardDictionary } from "../GameLogic/Constans/constans_cards";

export default function handleSocketConnections(io: Server) {
    io.on('connection', (socket: Socket) => {

        socket.on("join-game", (userId: string, gameId: string) => {
            //if game is existing in GameManager
            socket.join(gameId);

            const gameState = gamesManager.getGame(gameId);
            const player: Player = new Player(userId, socket);

            gameState?.addPlayer(player);
        });

        socket.on("card-event", (cardId: string, gameId: string) => {
            console.log(`card-event room id: ${gameId}`);
            socket.to(gameId).emit("card-event-server", `Player ${socket.id} played card: ${cardDictionary[cardId].title}`);
        });
    });
}