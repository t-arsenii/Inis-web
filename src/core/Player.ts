import { Socket } from "socket.io";
import { CLANS_PER_PLAYER } from "./constans/constant_3_players";
import { playerAction } from "../types/Enums";
import { challengerTokens } from "../types/Types";
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
    challengerTokens: challengerTokens = {
        sancturies: false,
        clans: false,
        territories: false
    };
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