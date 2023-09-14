import { Socket } from "socket.io";
import { CLANS_PER_PLAYER } from "../constans/constans_3_players";
enum playerLastAction{
    None,
    Card,
    Coin,
    Pass
}
export class Player {
    Id: string = "";
    Socket: Socket | undefined
    isBren: boolean = false
    isActive = false
    lastAction: playerLastAction = playerLastAction.None

    //Hand
    // ActionCards: Card[] = [];
    // EposCards: Card[] = [];
    // AdvantagesCards: Card[] = [];
    //Tokens
    DeedTokens: number = 0;
    ChallengerTokens: number = 0;
    //Clans
    ClansLeft: number = CLANS_PER_PLAYER;
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