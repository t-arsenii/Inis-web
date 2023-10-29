import { Socket } from "socket.io";
import { CLANS_PER_PLAYER } from "./constans/constant_3_players";
import { playerAction } from "../types/Enums";
import { PretenderTokens } from "../types/Types";
import { IPlayer } from "../types/Interfaces";
export class Player implements IPlayer {
    //User info
    id: string;
    username: string = undefined!;
    socket: Socket | null = null;
    mmr: number = undefined!;
    color: string = undefined!;
    //Game logic
    isBren: boolean = false;
    isActive = false;
    lastAction: playerAction = playerAction.None;
    //Tokens
    deedTokens: number = 0;
    pretenderTokens: PretenderTokens = {
        sanctuaries: false,
        clans: false,
        territories: false
    };
    clansLeft: number = CLANS_PER_PLAYER;
    constructor(
        id: string
    ) {
        this.id = id;
    }

}