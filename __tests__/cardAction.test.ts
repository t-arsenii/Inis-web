import { gamesManager } from "../src/core/GameStateManager"
import { DruidSeason } from "../src/core/cardOperations/cardAction"

test("Druid Card Test: no target id provided", () => {
    const gameState = gamesManager.getGame("54a94296-eb0b-45dc-a6f6-544559cf6b8b")!;
    const player = gameState.GetPlayerById("6dd6246a-f15b-43f8-bd67-5a38aa91184e")!;
    const callDruidSeason = () => {
        DruidSeason({ gameState, player });
    };
    expect(callDruidSeason).toThrowError();
})

// describe('DruidSeason Function', () => {
//   // Define a mock ICardOperationParams for testing
//   const mockParams = {
//     gameState: /* Mock gameState */,
//     player: /* Mock player */,
//     targetCardId: /* Mock targetCardId */,
//   };

//   it('should throw an error when targetCardId is undefined', () => {
//     expect(() => DruidSeason({ ...mockParams, targetCardId: undefined })).toThrowError(
//       'DruidSeason: Target id is undefined'
//     );
//   });

//   it('should throw an error when druid is the last card', () => {
//     // Mock a deck with only one action card
//     const gameStateWithLastCard = /* Mock gameState with one action card in the deck */;
//     const playerWithLastCard = /* Mock player */;
//     const targetCardId = /* Mock targetCardId */;
    
//     expect(() => DruidSeason({ gameState: gameStateWithLastCard, player: playerWithLastCard, targetCardId })).toThrowError(
//       'DruidSeason: druid is a last card'
//     );
//   });

//   it('should throw an error when the targetCardId is not in the discard', () => {
//     // Mock a situation where targetCardId is not in the discard
//     const gameStateWithDiscard = /* Mock gameState with some cards in the discard */;
//     const playerWithCard = /* Mock player */;
//     const targetCardIdNotInDiscard = /* Target card id that is not in the discard */;
    
//     expect(() => DruidSeason({ gameState: gameStateWithDiscard, player: playerWithCard, targetCardId: targetCardIdNotInDiscard })).toThrowError(
//       `DruidSeason: no card with id:${targetCardIdNotInDiscard}, is in discard`
//     );
//   });

//   it('should not throw an error when all conditions are met', () => {
//     // Mock a situation where all conditions are met, and the function should not throw errors
//     const gameStateValid = /* Mock gameState with valid conditions */;
//     const playerValid = /* Mock player */;
//     const targetCardIdValid = /* Valid target card id */;
    
//     expect(() => DruidSeason({ gameState: gameStateValid, player: playerValid, targetCardId: targetCardIdValid })).not.toThrow();
//   });
// });