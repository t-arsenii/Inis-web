import { Socket } from "socket.io";
import { GameState } from "./src/core/GameState";
import { Player } from "./src/core/Player"
declare module "socket.io" {
    interface Socket {
        gameState?: GameState;
        player?: Player;
    }
}