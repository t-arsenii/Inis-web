import { ICardOperationParams } from "../../types/Interfaces";
import { hexToAxialCoordinates } from "../../utils/helperFunctions";
import { Hexagon } from "../map/Field";

function DagdaHarpSeason({ gameState, player, axialToNum }: ICardOperationParams): void {
    if (!axialToNum) {
        throw new Error(`DagdaHarpSeason: no axialToNum specified`);
    }
    if (!Array.isArray(axialToNum)) {
        throw new Error(`DagdaHarpSeason: axialToNum is not an array`);
    }
    if (axialToNum.length > 3) {
        throw new Error(`DagdaHarpSeason: axialToNum length can not be greater than 3`);
    }
    const playerDeck = gameState.deckManager.getPlayerDeck(player);
    const eposCardNum = playerDeck.eposCards.length;
    if (eposCardNum === 0) {
        return;
    }
    const playerFieldPresence = gameState.hexGridManager.fieldsController.GetPlayerHex(player);
    if (!playerFieldPresence) {
        return;
    }
    for (const singleAxiale of axialToNum) {
        if (!gameState.hexGridManager.HasHexagon(singleAxiale.axial)) {
            throw new Error(`DagdaHarpSeason: no hexagon with axial:${singleAxiale}`);
        }
        const hex: Hexagon = gameState.hexGridManager.GetHex(singleAxiale.axial)!;
        if (!playerFieldPresence.includes(hex)) {
            throw new Error(`DagdaHarpSeason: player is not present on axial:${singleAxiale}`);
        }
        if (singleAxiale.num >= 0) {
            throw new Error('DagdaHarpSeason: singleAxiale.num must be greater than 0');
        }
    }
    const clansNum = axialToNum.reduce((sum, axNum) => sum + axNum.num, 0);
    if (clansNum > 3) {
        throw new Error('DagdaHarpSeason: totalClans must be less or equal to 3');
    }
    if (!gameState.hexGridManager.clansController.IsEnoughClans(player, clansNum)) {
        throw new Error(`DagdaHarpSeason: player has not enough clans`);
    }
    for (const singleAxiale of axialToNum) {
        gameState.hexGridManager.clansController.AddClans(player, singleAxiale.num, singleAxiale.axial);
    }
}
function HeroShareSeason({ gameState, player }: ICardOperationParams): void {
    if (!gameState.deckManager.defferedCardId) {
        return;
    }
    gameState.deckManager.GiveDefferedCard(player);
}
function EyeOfBalorSeason({ gameState, player, singleAxial, targetPlayerId }: ICardOperationParams): void {
    if (!singleAxial) {
        return;
    }
    if (!targetPlayerId) {
        return;
    }
    if (!gameState.hexGridManager.HasHexagon(singleAxial)) {
        return;
    }
    if (!gameState.playerManager.HasPlayer(targetPlayerId)) {
        return;
    }
    const hex: Hexagon = gameState.hexGridManager.GetHex(singleAxial)!;
    const targetPlayer = gameState.playerManager.GetPlayerById(targetPlayerId)!;
    if (!hex.field.hasClans(targetPlayer)) {
        return;
    }
    gameState.hexGridManager.clansController.RemoveClans(targetPlayer, 1, hexToAxialCoordinates(hex));
}
function DanuChildrenSeason({ gameState, player, singleAxial }: ICardOperationParams) {
    if (!singleAxial) {
        return;
    }
    if (!gameState.hexGridManager.HasHexagon(singleAxial)) {
        return;
    }
    if (!gameState.hexGridManager.clansController.IsEnoughClans(player, 1)) {
        return;
    }
    gameState.hexGridManager.clansController.AddClans(player, 1, singleAxial);
}
function FalStoneSeason({ gameState, player }: ICardOperationParams): void {
    if (!gameState.hexGridManager.clansController.IsEnoughClans(player, 1)) {
        return;
    }
    const capitalHex = gameState.hexGridManager.fieldsController.capitalHex!;
    gameState.hexGridManager.clansController.AddClans(player, 2, hexToAxialCoordinates(capitalHex));
}

export {
    DagdaHarpSeason,
    HeroShareSeason,
    EyeOfBalorSeason,
    DanuChildrenSeason,
    FalStoneSeason
}