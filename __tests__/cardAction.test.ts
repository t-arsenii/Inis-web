import { gamesManager } from "../src/gameState/GameStateManager"
import { DruidSeason } from "../src/core/cardOperations/cardAction"

test("Druid Card Test: no target id provided", () => {
    const gameState = gamesManager.getGame("54a94296-eb0b-45dc-a6f6-544559cf6b8b")!;
    const player = gameState.GetPlayerById("6dd6246a-f15b-43f8-bd67-5a38aa91184e")!;
    const callDruidSeason = () => {
        DruidSeason({ gameState, player });
    };
    expect(callDruidSeason).toThrowError();
})