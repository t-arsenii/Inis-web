import { hexToAxialCoordinates } from "../../utils/helperFunctions"
import { axialCoordinates } from "../../types/Types"
import { Player } from "../Player"
import { HexGridManager } from "./HexGridManager"
import { Hexagon, Field } from "./Field"

export class ClansController {
    private playerFieldPresense: Map<string, Hexagon[]>;
    private hexGrid: HexGridManager;
    constructor(hexGrid: HexGridManager) {
        this.hexGrid = hexGrid;
        this.playerFieldPresense = hexGrid.fieldsController.playerFieldPresense;
    }
    public AddClans(player: Player, clansNum: number, axial: axialCoordinates): void {
        if (clansNum <= 0) {
            throw new Error("ClansController.AddClans: clansNum can't be negative or 0")
        }
        if (!this.hexGrid.HasHexagon(axial)) {
            throw new Error(`ClansController.AddClans: no hexagon with axial:${axial}`)
        }
        const hex: Hexagon = this.hexGrid.GetHex(axial)!
        const field: Field = hex.field
        if (clansNum > player.clansLeft) {
            throw new Error(`ClansController.AddClans: player not enoght clans left`)
        }
        if (field.playersClans.has(player.id)) {
            const currentClans = field.playersClans.get(player.id)!
            field.playersClans.set(player.id, currentClans + clansNum)
        } else {
            field.playersClans.set(player.id, clansNum)
        }
        player.clansLeft -= clansNum
        const playerFieldsPresense: Hexagon[] = this.playerFieldPresense.get(player.id)!
        if (!playerFieldsPresense.includes(hex)) {
            playerFieldsPresense.push(hex)
        }
        hex.field.UpdateLeader()
    }
    public RemoveClans(player: Player, clansNum: number, axial: axialCoordinates): void {
        if (clansNum <= 0) {
            throw new Error("ClansController.RemoveClans: clansNum can't be negative or 0")
        }
        if (!this.hexGrid.HasHexagon(axial)) {
            throw new Error(`ClansController.RemoveClans: no hexagon with axial:${axial}`)
        }
        const hex: Hexagon = this.hexGrid.GetHex(axial)!;
        const field: Field = hex.field;
        if (!field.playersClans.has(player.id)) {
            throw new Error("ClansController.RemoveClans: the player has no clans to remove on field")
        }
        const playerCurrentClans = field.playersClans.get(player.id)!;
        if (clansNum > playerCurrentClans) {
            throw new Error("ClansController.RemoveClans: the clansNum can't be larger than currentClans on field")
        }
        if (clansNum === playerCurrentClans) {
            const playerFieldsPresence = this.playerFieldPresense.get(player.id)!;
            this.playerFieldPresense.set(player.id, playerFieldsPresence.filter(h => h !== hex));
            field.playersClans.delete(player.id);
        } else {
            field.playersClans.set(player.id, playerCurrentClans - clansNum);
        }
        player.clansLeft += clansNum;
        hex.field.UpdateLeader()
    }
    public MoveClans(player: Player, axialFrom: axialCoordinates, axialTo: axialCoordinates, clansNum: number) {
        if (clansNum <= 0) {
            throw new Error("ClansController.MoveClans: clansNum can't be negative or 0")
        }
        if (!this.hexGrid.HasHexagon(axialFrom)) {
            throw new Error(`ClansController.MoveClans: no hexagon with axial:${axialFrom}`)
        }
        if (!this.hexGrid.HasHexagon(axialTo)) {
            throw new Error(`ClansController.MoveClans: no hexagon with axial:${axialTo}`)
        }
        const hexFrom: Hexagon = this.hexGrid.GetHex(axialFrom)!
        const hexTo: Hexagon = this.hexGrid.GetHex(axialTo)!
        if (!hexFrom.field.playersClans.has(player.id)) {
            throw new Error("ClansController.MoveClans: the player has no clans to move from field")
        }
        const playerCurrentClans = hexFrom.field.playersClans.get(player.id)!;
        if (clansNum > playerCurrentClans) {
            throw new Error("ClansController.MoveClans: the clansNum can't be larger than currentClans on field")
        }
        const playerFieldsPresence: Hexagon[] = this.playerFieldPresense.get(player.id)!;
        if (clansNum === playerCurrentClans) {
            this.playerFieldPresense.set(player.id, playerFieldsPresence.filter(h => h !== hexFrom));
            hexFrom.field.playersClans.delete(player.id);
        } else {
            hexFrom.field.playersClans.set(player.id, playerCurrentClans - clansNum);
        }
        if (hexTo.field.playersClans.has(player.id)) {
            const currentClans = hexTo.field.playersClans.get(player.id)!
            hexTo.field.playersClans.set(player.id, currentClans! + clansNum)
        } else {
            hexTo.field.playersClans.set(player.id, clansNum)
        }
        if (!playerFieldsPresence.includes(hexTo)) {
            playerFieldsPresence.push(hexTo)
        }

        //checking holiday token
        if (this.hexGrid.fieldsController.festivalHex == hexTo) {
            this.RemoveClans(player, 1, hexToAxialCoordinates(hexTo))
        }
        //updating field leader
        hexTo.field.UpdateLeader()
        hexFrom.field.UpdateLeader()
    }
}