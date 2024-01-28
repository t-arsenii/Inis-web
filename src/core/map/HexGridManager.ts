import { AxialToString } from "../../utils/helperFunctions";
import { axialCoordinates } from "../../types/Types";
import { GameState } from "../gameState/GameState";
import { ClansController } from "./ClansController";
import { FieldsController } from "./FieldsController";
import { Field, Hexagon } from "./Field";
import { SetupController } from "./SetupController";
import { MAX_SANCTUARIES, MAX_CITADELS } from "../constans/constant_3_players";

export class HexGridManager {
    public hexGrid: Map<string, Hexagon>;
    public fieldsController: FieldsController;
    public clansController: ClansController;
    public setupController: SetupController;
    public _gameState: GameState;
    constructor(gameState: GameState) {
        this._gameState = gameState;
        this.hexGrid = new Map<string, Hexagon>();
        this.fieldsController = new FieldsController(this);
        this.setupController = new SetupController(this);
        this.clansController = new ClansController(this);
    }
    public GetAllValidPlacements(): axialCoordinates[] {
        const validPlacements: axialCoordinates[] = [];

        // Find the minimum and maximum coordinates to determine the grid size
        let minQ = Infinity;
        let maxQ = -Infinity;
        let minR = Infinity;
        let maxR = -Infinity;

        for (const hexagon of this.hexGrid.values()) {
            minQ = Math.min(minQ, hexagon.q);
            maxQ = Math.max(maxQ, hexagon.q);
            minR = Math.min(minR, hexagon.r);
            maxR = Math.max(maxR, hexagon.r);
        }
        minQ--;
        maxQ++;
        minR--;
        maxR++;

        const axial: axialCoordinates = {
            q: 0,
            r: 0
        }
        for (let q = minQ; q <= maxQ; q++) {
            for (let r = minR; r <= maxR; r++) {
                axial.q = q
                axial.r = r
                if (this.CanPlaceFieldBetween(axial)) {
                    validPlacements.push({ q, r });
                }
            }
        }
        return validPlacements;
    }
    public GetNeighbors(axial: axialCoordinates): Hexagon[] {
        const directions = [
            { q: 1, r: 0 },
            { q: 0, r: -1 },
            { q: -1, r: 0 },
            { q: -1, r: 1 },
            { q: 0, r: 1 },
            { q: 1, r: -1 },
        ];
        const neighbors: Hexagon[] = [];
        const axialNeighbor: axialCoordinates = {
            q: 0,
            r: 0
        }
        for (const dir of directions) {
            axialNeighbor.q = axial.q + dir.q;
            axialNeighbor.r = axial.r + dir.r;
            if (this.HasHexagon(axialNeighbor)) {
                neighbors.push(this.hexGrid.get(AxialToString(axialNeighbor))!);
            }
        }
        return neighbors;
    }
    public CanPlaceFieldBetween(axial: axialCoordinates): boolean {
        if (!this.HasHexagon(axial)) {
            const neighbors = this.GetNeighbors(axial);
            if (neighbors.length >= 2) {
                return true;
            }
        }
        return false;
    }
    public HasHexagon(axial: axialCoordinates): boolean {
        const key = AxialToString(axial);
        return this.hexGrid.has(key);
    }
    public GetHex(axial: axialCoordinates): Hexagon | undefined {
        return this.hexGrid.get(AxialToString(axial))
    }
    public GetAllHex(): Hexagon[] {
        return Array.from(this.hexGrid.values())
    }
    public Init(): void {
        if (this.hexGrid.size > 0) {
            return;
        }
        const t1Id = this.fieldsController.avalibleTerritories.pop()!;
        const t2Id = this.fieldsController.avalibleTerritories.pop()!;
        const t3Id = this.fieldsController.avalibleTerritories.pop()!;

        const players = this._gameState.playerManager.GetPlayers();
        players.forEach((player) => {
            this.fieldsController.playerFieldPresense.set(player.id, []);
        })

        const hex1 = new Hexagon({ q: 0, r: 0 }, new Field(t1Id, this._gameState));
        const hex2 = new Hexagon({ q: 1, r: 0 }, new Field(t2Id, this._gameState));
        const hex3 = new Hexagon({ q: 0, r: 1 }, new Field(t3Id, this._gameState));

        this.hexGrid.set(AxialToString({ q: hex1.q, r: hex1.r }), hex1);
        this.hexGrid.set(AxialToString({ q: hex2.q, r: hex2.r }), hex2);
        this.hexGrid.set(AxialToString({ q: hex3.q, r: hex3.r }), hex3);

        this.fieldsController.sanctuariesLeft = MAX_SANCTUARIES;
        this.fieldsController.citadelsLeft = MAX_CITADELS;
    }
}
