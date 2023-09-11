import { Socket } from "socket.io";
import { Card } from "./Card";

export class Player {
    Id: string = "";
    Socket: Socket | undefined
    isBren: boolean = false
    isActive = false
    //Hand
    // ActionCards: Card[] = [];
    // EposCards: Card[] = [];
    // AdvantagesCards: Card[] = [];
    //Tokens
    DeedTokens: number = 0;
    ChallengerTokens: number = 0;
    //Clans
    CurrentClans: number = 0;
    //Stats
    TerritoriesPresence: number = 0;
    SanctuariesPresence: number = 0;
    ClansDomination: number = 0;
    constructor(
        id: string
    ) {
        this.Id = id;
    }

}