import { AxialToString } from "../../services/helperFunctions";
import { axialCoordinates } from "../../types/Types";
import { GameState } from "../../gameState/GameState";
import { ClansController } from "./ClansController";
import { FieldsController } from "./FieldsController";
import { Hexagon } from "./HexagonField";
import { SetupController } from "./SetupController";

export class HexGrid {
    public grid: Map<string, Hexagon> = new Map<string, Hexagon>();
    public fieldsController: FieldsController = new FieldsController(this)
    public clansController: ClansController = new ClansController(this, this.fieldsController.playerFieldPresense)
    public setupController: SetupController
    public gameState: GameState
    constructor(gameState: GameState) {
        this.gameState = gameState
        this.setupController = new SetupController(gameState)
    }
    public GetAllValidPlacements(): axialCoordinates[] {
        const validPlacements: axialCoordinates[] = [];

        // Find the minimum and maximum coordinates to determine the grid size
        let minQ = Infinity;
        let maxQ = -Infinity;
        let minR = Infinity;
        let maxR = -Infinity;

        for (const hexagon of this.grid.values()) {
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
                neighbors.push(this.grid.get(AxialToString(axialNeighbor))!);
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
        return this.grid.has(key);
    }
    public GetHex(axial: axialCoordinates): Hexagon | undefined {
        return this.grid.get(AxialToString(axial))
    }
    public GetAllHex(): Hexagon[] {
        return Array.from(this.grid.values())
    }
}
