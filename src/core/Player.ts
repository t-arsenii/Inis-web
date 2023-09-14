import { Socket } from "socket.io";
import { CLANS_PER_PLAYER } from "../constans/constans_3_players";
import { playerAction } from "../types/Enums";
export class Player {
    id: string = "";
    socket: Socket | undefined
    isBren: boolean = false
    isActive = false
    lastAction: playerAction = playerAction.None

    //Hand
    // ActionCards: Card[] = [];
    // EposCards: Card[] = [];
    // AdvantagesCards: Card[] = [];
    //Tokens
    deedTokens: number = 0;
    challengerTokens: number = 0;
    //Clans
    clansLeft: number = CLANS_PER_PLAYER;
    //Stats
    territoriesPresence: number = 0;
    sanctuariesPresence: number = 0;
    clansDomination: number = 0;
    constructor(
        id: string
    ) {
        this.id = id;
    }

}