import { Socket } from "socket.io";
import { CLANS_PER_PLAYER } from "./constans/constant_3_players";
import { Color, playerAction } from "../types/Enums";
import { PretenderTokensType } from "../types/Types";
import { IPlayer } from "../types/Interfaces";
export class Player implements IPlayer {
    //User info
    id: string;
    username: string;
    socket: Socket | null;
    mmr: number;
    color: Color;
    //Game logic
    isBren: boolean;
    isActive: boolean;
    lastAction: playerAction;
    //Tokens
    deedTokens: number;
    pretenderTokens: PretenderTokensType;
    clansLeft: number;
    constructor(
        id: string
    ) {
        //User info
        this.id = id;
        this.username = undefined!;
        this.socket = null;
        this.mmr = undefined!;
        this.color = undefined!;
        //Game logic
        this.isBren = false;
        this.isActive = false;
        this.lastAction = playerAction.None;
        this.deedTokens = 0;
        this.pretenderTokens = {
            sanctuaries: false,
            clans: false,
            territories: false
        }
        this.clansLeft = CLANS_PER_PLAYER;
    }

}