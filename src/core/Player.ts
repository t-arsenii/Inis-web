import { Socket } from "socket.io";
import { CLANS_PER_PLAYER } from "./constans/constant_3_players";
import { playerAction } from "../types/Enums";
import { challengerTokens } from "../types/Types";
export class Player {
    id: string = "";
    socket: Socket | null = null
    isBren: boolean = false
    isActive = false
    lastAction: playerAction = playerAction.None
    //Tokens
    deedTokens: number = 0;
    challengerTokens: challengerTokens = {
        sanctuaries: false,
        clans: false,
        territories: false
    };
    //Clans
    clansLeft: number = CLANS_PER_PLAYER;
    //Stats
    constructor(
        id: string
    ) {
        this.id = id;
    }

}