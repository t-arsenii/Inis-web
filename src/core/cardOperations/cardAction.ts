import { HexGridManager } from "../map/HexGridManager";
import { Sanctuary, cardActionMap } from "../constans/constant_action_cards";
import { ICardOperationParams } from "../../types/Interfaces";
import { Deck, DeckManager } from "../DeckManager";
import { trixelCondition_bxaty } from "../constans/constant_trixelConditions";
import { Player } from "../Player";
import { hexToAxialCoordinates } from "../../utils/helperFunctions";
import { Hexagon } from "../map/Field";
export function BardSeason({ gameState, player }: ICardOperationParams): void {
    gameState.deckManager.AddRandomEposCard(player);
}
export function BardTrixel({ gameState, player }: ICardOperationParams): void {
    if (!gameState.trixelManager.HasTrixel(player, trixelCondition_bxaty)) {
        throw new Error("BardTrixel: player dosen't have condition to play trixel");
    }
    gameState.AddDeedToken(player);
    gameState.eventEmitter.emit('TrixelEvent');
}
export function DruidSeason({ gameState, player, targetCardId }: ICardOperationParams) {
    if (!targetCardId) {
        throw new Error("DruidSeason: Target id is undefiend");
    }
    const deckManager: DeckManager = gameState.deckManager
    const deck: Deck = deckManager.playersDeck.get(player.id)!;
    if (deck.actionCards.length === 1) {
        throw new Error("DruidSeason: druid is a last card");
    }
    if (!deckManager.actionDiscard.includes(targetCardId)) {
        throw new Error(`DruidSeason: no card with id:${targetCardId}, is in discard`)
    }
    deckManager.actionDiscard = deckManager.actionDiscard.filter(cId => cId !== targetCardId)
    deckManager.AddCard(player, targetCardId)
}
export function PeasantsWorkersSeason({ gameState, player, axialToNum }: ICardOperationParams): void {
    if (!axialToNum) {
        throw new Error("PeasantsWorkersSeason: axialToNum field is undefiend")
    }
    const playerHex: Hexagon[] = gameState.hexGridManager.fieldsController.GetPlayerHex(player)!
    let citadelNum: number = gameState.hexGridManager.fieldsController.CountPlayerCitadels(player)
    if (!Array.isArray(axialToNum)) {
        throw new Error("PeasantsWorkersSeason: axialToNum field error");
    }

    const clansNum = axialToNum.reduce((sum, axNum) => sum + axNum.num, 0);
    if (clansNum > player.clansLeft || clansNum !== citadelNum) {
        throw new Error("PeasantsWorkersSeason: wrong number of clans")
    }
    for (var axNum of axialToNum) {
        if (!gameState.hexGridManager.HasHexagon(axNum.axial)) {
            throw new Error(`PeasantsWorkersSeason: no hexagon with axial:${axNum.axial}`)
        }
        let hex: Hexagon = gameState.hexGridManager.GetHex(axNum.axial)!
        if (!playerHex.includes(hex)) {
            throw new Error(`PeasantsWorkersSeason: player is not present on axial:${axNum.axial}`)
        }
    }
    for (var axNum of axialToNum) {
        gameState.hexGridManager.clansController.AddClans(player, axNum.num, axNum.axial)
    }

    // if (typeof axialToNum === 'object' && !Array.isArray(axialToNum)) {
    //     const clansNum = axialToNum.num
    //     if (clansNum > player.clansLeft || clansNum !== citadelNum) {
    //         throw new Error("PeasantsWorkersSeason: wrong number of clans")
    //     }
    //     if (!gameState.hexGridManager.HasHexagon(axialToNum.axial)) {
    //         throw new Error(`PeasantsWorkersSeason: no hexagon with axial:${axialToNum.axial}`)
    //     }
    //     let hex: Hexagon = gameState.hexGridManager.GetHex(axialToNum.axial)!
    //     if (!playerHex.includes(hex)) {
    //         throw new Error(`PeasantsWorkersSeason: player is not present on axial:${axialToNum.axial}`)
    //     }
    //     gameState.hexGridManager.clansController.AddClans(player, axialToNum.num, axialToNum.axial)
    // }
}
export function SanctuarySeason({ gameState, player, singleAxial }: ICardOperationParams): void {
    if (Array.isArray(singleAxial) || singleAxial === undefined || typeof singleAxial !== 'object') {
        throw new Error(`SanctuarySeason: axial field error`);
    }
    if (gameState.hexGridManager.fieldsController.sanctuariesLeft <= 0) {
        throw new Error(`SanctuarySeason: no sancturies left`);
    }
    const map: HexGridManager = gameState.hexGridManager
    if (!gameState.hexGridManager.GetHex(singleAxial)) {
        throw new Error(`SanctuarySeason: no hexagon with axial:${singleAxial}`);
    }
    const hex: Hexagon = map.GetHex(singleAxial)!;
    const playerHex: Hexagon[] = map.fieldsController.GetPlayerHex(player)!;
    if (!playerHex.includes(hex)) {
        throw new Error(`SanctuarySeason: player is not present on axial:${singleAxial}`);
    }
    map.fieldsController.AddSanctuary(hexToAxialCoordinates(hex));
    //Add Epos card to player
    // gameState.deckManager.AddRandomEposCard(player)
}
export function CitadelSeason({ gameState, player, singleAxial }: ICardOperationParams): void {
    if (Array.isArray(singleAxial) || singleAxial === undefined || typeof singleAxial !== 'object') {
        throw new Error(`CitadelSeason: axial field error`);
    }
    if (gameState.hexGridManager.fieldsController.citadelsLeft <= 0) {
        throw new Error(`CitadelSeason: no citadels left`);
    }
    if (!gameState.hexGridManager.HasHexagon(singleAxial)) {
        throw new Error(`CitadelSeason: no hexagon with axial:${singleAxial}`);
    }
    const hex: Hexagon = gameState.hexGridManager.GetHex(singleAxial)!;
    const playerHex: Hexagon[] = gameState.hexGridManager.fieldsController.GetPlayerHex(player)!;
    if (!playerHex.includes(hex)) {
        throw new Error(`CitadelSeason: player is not present on axial:${singleAxial}`);
    }
    gameState.hexGridManager.fieldsController.citadelsLeft--;
    hex.field.citadelsCount++;
    //Add Advantage card to player if possible
}
export function NewClansSeason({ gameState, player, axial }: ICardOperationParams): void {
    if (!axial) {
        throw new Error(`NewClansSeason: axial field error`);
    }
    if (!Array.isArray(axial)) {
        throw new Error(`NewClansSeason: axial field error`);
    }
    if (axial.length > 2) {
        throw new Error(`NewClansSeason: axial array length error`);
    }
    if (axial.length === 2) {
        if (!gameState.hexGridManager.HasHexagon(axial[0])) {
            throw new Error(`NewClansSeason: no hexagon with axial:${axial[0]}`);
        }
        if (!gameState.hexGridManager.HasHexagon(axial[1])) {
            throw new Error(`NewClansSeason: no hexagon with axial:${axial[1]}`);
        }
        const hex1: Hexagon = gameState.hexGridManager.GetHex(axial[0])!;
        const hex2: Hexagon = gameState.hexGridManager.GetHex(axial[1])!;
        const playerHex: Hexagon[] = gameState.hexGridManager.fieldsController.GetPlayerHex(player)!
        if (!playerHex.includes(hex1)) {
            throw new Error(`NewClansSeason: player is not present on axial:${axial[0]}`);
        }
        if (!playerHex.includes(hex2)) {
            throw new Error(`NewClansSeason: player is not present on axial:${axial[1]}`);
        }
        gameState.hexGridManager.clansController.AddClans(player, 1, axial[0]);
        gameState.hexGridManager.clansController.AddClans(player, 1, axial[1]);
    }
    if (axial.length === 1) {
        if (!gameState.hexGridManager.HasHexagon(axial[0])) {
            throw new Error(`NewClansSeason: no hexagon with axial:${axial}`);
        }
        const hex: Hexagon = gameState.hexGridManager.GetHex(axial[0])!
        const playerHex: Hexagon[] = gameState.hexGridManager.fieldsController.GetPlayerHex(player)!
        if (!playerHex.includes(hex)) {
            throw new Error(`NewClansSeason: player is not present on axial:${axial}`)
        }
        gameState.hexGridManager.clansController.AddClans(player, 2, axial[0]);
    }
}
export function ExplorationSeason({ gameState, player, singleAxial }: ICardOperationParams): void {
    if (!singleAxial || typeof singleAxial !== 'object' || Array.isArray(singleAxial)) {
        throw new Error(`ExplorationSeason: axial field error`)
    }
    try {
        gameState.hexGridManager.fieldsController.AddRandomField(singleAxial)
        gameState.hexGridManager.clansController.AddClans(player, 1, singleAxial)
    } catch (e) {
        throw e;
    }
}
export function HolidaySeason({ gameState, player, singleAxial }: ICardOperationParams): void {
    if (!singleAxial || typeof singleAxial !== `object` || Array.isArray(singleAxial)) {
        throw new Error(`HolidaySeason: axial field error`);
    }
    const hex: Hexagon | undefined = gameState.hexGridManager.GetHex(singleAxial);
    if (!hex) {
        throw new Error(`HolidaySeason: no hexagon with axial:${singleAxial}`);
    }
    const hexArr: Hexagon[] = gameState.hexGridManager.fieldsController.GetPlayerHex(player)!
    if (!hexArr.includes(hex)) {
        throw new Error(`HolidaySeason: player is not present on axial:${singleAxial}`)
    }
    if (hex.field.sanctuaryCount === 0) {
        throw new Error(`HolidaySeason: no sanctuaries`)
    }
    if (player.clansLeft > 0) {
        gameState.hexGridManager.clansController.AddClans(player, 1, singleAxial)
    }
    gameState.hexGridManager.fieldsController.SetHolidayField(singleAxial)
}
export function ConquestSeason({ gameState, player, singleAxial, axialToNum }: ICardOperationParams): void {
    //validate data
    if (!singleAxial || typeof singleAxial !== `object` || Array.isArray(singleAxial)) {
        throw new Error(`ConquestSeason: targetAxial field error`)
    }
    if (!axialToNum) {
        throw new Error(`ConquestSeason: targetAxial field error`)
    }
    if (!gameState.hexGridManager.HasHexagon(singleAxial)) {
        throw new Error(`ConquestSeason: no hexagon with axial:${singleAxial}`)
    }
    //validate hexagons
    const playerHex: Hexagon[] = gameState.hexGridManager.fieldsController.GetPlayerHex(player)!;
    const hexNeighbours: Hexagon[] = gameState.hexGridManager.GetNeighbors({ q: singleAxial.q, r: singleAxial.r });
    const targetHexagon: Hexagon = gameState.hexGridManager.GetHex(singleAxial)!;
    if (!Array.isArray(axialToNum)) {
        throw new Error("ConquestSeason: axialToNum field error");
    }
    for (const ax of axialToNum) {
        if (!gameState.hexGridManager.HasHexagon(ax.axial)) {
            throw new Error(`ConquestSeason: no hexagon with axial:${ax.axial}`)
        }
        let hex: Hexagon = gameState.hexGridManager.GetHex(ax.axial)!
        if (!playerHex.includes(hex)) {
            throw new Error(`ConquestSeason: player is not present on axial:${ax.axial}`)
        }
        if (!hexNeighbours.includes(hex)) {
            throw new Error(`ConquestSeason: the axial:${ax.axial}, is not a neighbour`)
        }
        //Check clans
        if (!hex.field.playersClans.has(player.id)) {
            throw new Error(`ConquestSeason: player dosen't have clans on axial:${ax.axial}`)
        }
        if (hex.field.playersClans.get(player.id)! < ax.num) {
            throw new Error(`ConquestSeason:player dosen't have enough clans on the axial:${ax.axial}`)
        }
        for (const ax of axialToNum) {
            gameState.hexGridManager.clansController.MoveClans(player, ax.axial, singleAxial, ax.num)
        }
    }
    // else if (typeof axialToNum === 'object' && !Array.isArray(axialToNum)) {
    //     if (!gameState.hexGridManager.HasHexagon(axialToNum.axial)) {
    //         throw new Error(`ConquestSeason: no hexagon with axial:${axialToNum.axial}`)
    //     }
    //     let hex: Hexagon = gameState.hexGridManager.GetHex(axialToNum.axial)!
    //     if (!playerHex.includes(hex)) {
    //         throw new Error(`ConquestSeason: player is not present on axial:${axialToNum.axial}`)
    //     }
    //     if (!hexNeighbours.includes(hex)) {
    //         throw new Error(`ConquestSeason: the axial:${axialToNum.axial}, is not a neighbour`)
    //     }
    //     //Check clans
    //     if (!hex.field.playersClans.has(player.id)) {
    //         throw new Error(`ConquestSeason: player dosen't have clans on axial:${axialToNum.axial}`)
    //     }
    //     if (hex.field.playersClans.get(player.id)! < axialToNum.num) {
    //         throw new Error(`ConquestSeason:player dosen't have enough clans on the axial:${axialToNum.axial}`)
    //     }
    //     gameState.hexGridManager.clansController.MoveClans(player, axialToNum.axial, singleAxial, axialToNum.num)
    // }
    if (targetHexagon.field.playersClans.size > 1) {
        gameState.fightManager.InitFight(player, targetHexagon)
    }
}
export function NewUnionSeason({ gameState, player, singleAxial, targetPlayerId, cardVariation }: ICardOperationParams) {
    if (!cardVariation) {
        throw new Error("NewUnionSeason: card variation parameter error")
    }
    if (cardVariation === 1) {
        if (!singleAxial || typeof singleAxial !== 'object' || Array.isArray(singleAxial)) {
            throw new Error("NewUnionSeason(1): axial parameter error")
        }
        if (!gameState.hexGridManager.HasHexagon(singleAxial)) {
            throw new Error(`NewUnionSeason(1): no hexagon with axial:${singleAxial}`)
        }
        const hex: Hexagon = gameState.hexGridManager.GetHex(singleAxial)!
        const playerHex: Hexagon[] = gameState.hexGridManager.fieldsController.GetPlayerHex(player)!
        if (!playerHex.includes(hex)) {
            throw new Error(`NewUnionSeason(1): player is not present on axial:${singleAxial}`)
        }
        gameState.hexGridManager.clansController.AddClans(player, 1, singleAxial)
    }
    else if (cardVariation === 2) {
        if (!targetPlayerId) {
            throw new Error("NewUnionSeason(2): targetPlayerId parameter error")
        }
        if (!gameState.playerManager.HasPlayer(targetPlayerId)) {
            throw new Error("NewUnionSeason(2): targetPlayer not found")
        }
        const targetPlayer: Player = gameState.playerManager.GetPlayerById(targetPlayerId)!
        if (!singleAxial || typeof singleAxial !== 'object' || Array.isArray(singleAxial)) {
            throw new Error("NewUnionSeason(2): axial parameter error")
        }
        if (!gameState.hexGridManager.HasHexagon(singleAxial)) {
            throw new Error(`NewUnionSeason(2): no hexagon with axial:${singleAxial}`)
        }
        const hex: Hexagon = gameState.hexGridManager.GetHex(singleAxial)!
        const playerHex: Hexagon[] = gameState.hexGridManager.fieldsController.GetPlayerHex(player)!
        if (!playerHex.includes(hex)) {
            throw new Error(`NewUnionSeason(2): player is not present on axial:${singleAxial}`)
        }
        if (!hex.field.playersClans.has(targetPlayerId)) {
            throw new Error(`NewUnionSeason(2): targetPlayer is not present on field`)
        }
        if (hex.field.playersClans.get(targetPlayerId)! < 2) {
            throw new Error(`NewUnionSeason(2): targetPlayer has not enough clans`)
        }
        gameState.hexGridManager.clansController.AddClans(player, 1, singleAxial)
        gameState.hexGridManager.clansController.RemoveClans(targetPlayer, 1, singleAxial)

    } else {
        throw new Error("NewUnionSeason: CardVariation parameter error")
    }
}