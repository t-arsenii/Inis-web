import { Player } from "../src/core/Player";
import { DruidSeason } from "../src/core/cardOperations/cardAction";
import { Hexagon } from "../src/core/map/Field";
import { AxialToString, getRandomDirection, hexToAxialCoordinates, shuffle } from "../src/utils/helperFunctions";
import { TurnOrder } from "../src/types/Enums";
import { axialCoordinates } from "../src/types/Types";


test("shuffle array", () => {
    const elements = ["el1", "el2", "el3", "el4"];
    const shuffledElements = shuffle(elements);
    expect(shuffle(elements)).toHaveLength(shuffledElements.length)
    expect(shuffle(elements)).not.toEqual(shuffledElements);
    expect(elements.sort()).toEqual(shuffledElements.sort());
})

describe('getRandomDirection', () => {
    it('should return TurnOrder.clockwise or TurnOrder.counter_clockwise', () => {
        jest.spyOn(Math, 'random').mockReturnValue(0.25);

        const result1 = getRandomDirection();

        jest.spyOn(Math, 'random').mockReturnValue(0.75);

        const result2 = getRandomDirection();

        expect([TurnOrder.clockwise, TurnOrder.counter_clockwise]).toContain(result1);
        expect([TurnOrder.clockwise, TurnOrder.counter_clockwise]).toContain(result2);

        expect(result1).not.toBe(result2);
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });
});

describe('AxialToString', () => {
    it('should convert axial coordinates to a string', () => {
        const axial: axialCoordinates = { q: 3, r: 2 };
        const result = AxialToString(axial);
        expect(result).toBe('3,2');
    });

    it('should handle negative coordinates', () => {
        const axial: axialCoordinates = { q: -1, r: -4 };
        const result = AxialToString(axial);
        expect(result).toBe('-1,-4');
    });
});

describe('hexToAxialCoordinates', () => {
    it('should convert a Hexagon to axial coordinates', () => {
        const hexagon: Hexagon = new Hexagon({ q: 5, r: -3 }, undefined!);
        const result = hexToAxialCoordinates(hexagon);
        expect(result).toEqual({ q: 5, r: -3 });
    });

    it('should handle different Hexagon coordinates', () => {
        const hexagon: Hexagon = new Hexagon({ q: 0, r: 0 }, undefined!);
        const result = hexToAxialCoordinates(hexagon);
        expect(result).toEqual({ q: 0, r: 0 });
    });
});