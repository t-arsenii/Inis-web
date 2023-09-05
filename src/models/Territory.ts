type Territory = {
    readonly title: string
    readonly description?: string
    readonly hasSanctuary: boolean
    readonly sanctuaryCount: number
    readonly citadelsCount: number
    readonly playersClans: Map<string, number>
}

class Hexagon {
    public q: number
    public r: number
    public territory: Territory | null
    constructor(q: number, r: number) {
        this.q = q
        this.r = r
        this.territory = null
    }
}

class HexGrid {
    private grid: Hexagon[][];
    constructor(public width: number, public height: number) {
        this.grid = [];
        for (let q = 0; q < width; q++) {
            this.grid[q] = [];
            for (let r = 0; r < height; r++) {
                this.grid[q][r] = new Hexagon(q, r);
            }
        }
    }
}