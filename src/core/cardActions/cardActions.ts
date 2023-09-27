import { Player } from "../Player";
import { GameState } from "../GameState";
import { HexGrid, Hexagon } from "../HexGrid";
import { axialCoordiantes } from "../../types/Types";
import { Sanctuary, cardActionsMap } from "../../constans/constans_action_cards";
import { SanctuaryActionInfo } from "./cardActionsInfo";
import { ICardOperationParams } from "../../types/Interfaces";
import { Deck, DeckManager } from "../DeckManager";
import { AxialToString } from "../../services/helperFunctions";
export function BardAction({ gameState, player }: ICardOperationParams): void {
    //Giving player Epos card
}
export function DruidAction({ gameState, player, targetCardId }: ICardOperationParams) {
    if (!targetCardId) {
        throw new Error("DruidAction: Target id is undefiend")
    }
    const deckManager: DeckManager = gameState.deckManager
    const deck: Deck = deckManager.playersDeck.get(player.id)!
    if (!cardActionsMap.has(targetCardId)) {
        throw new Error("DruidAction: Target id is undefiend")
    }
    if (deck.ActionCards.length === 1) {
        throw new Error("DruidAction: druid is a last card")
    }
    if (!deckManager.currentDiscard.includes(targetCardId)) {
        throw new Error(`DruidAction: no card with id:${targetCardId}, is in discard`)
    }
    deckManager.currentDiscard = deckManager.currentDiscard.filter(cId => cId !== targetCardId)
    deckManager.addCard(player, targetCardId)


}
export function PeasantsWorkersAction({ gameState, player, axialToNum }: ICardOperationParams): void {
    if (!axialToNum) {
        throw new Error("PeasantsWorkersAction: axialToNum field is undefiend")
    }
    const playerHex: Hexagon[] = gameState.map.fieldsController.GetPlayerHex(player)!
    let citadelNum: number = gameState.map.fieldsController.CountPlayerCitadels(player)

    if (Array.isArray(axialToNum)) {
        const clansNum = axialToNum.reduce((sum, axNum) => sum + axNum.num, 0);
        if (clansNum > player.clansLeft || clansNum !== citadelNum) {
            throw new Error("PeasantsWorkersAction: wrong number of clans")
        }
        for (var axNum of axialToNum) {
            if (!gameState.map.HasHexagon(axNum.axial)) {
                throw new Error(`PeasantsWorkersAction: no hexagon with axial:${axNum.axial}`)
            }
            let hex: Hexagon = gameState.map.GetHex(axNum.axial)!
            if (!playerHex.includes(hex)) {
                throw new Error(`PeasantsWorkersAction: player is not present on axial:${axNum.axial}`)
            }
        }
        for (var axNum of axialToNum) {
            gameState.map.clansController.AddClans(player, axNum.num, axNum.axial)
        }
    }

    if (typeof axialToNum === 'object' && !Array.isArray(axialToNum)) {
        const clansNum = axialToNum.num
        if (clansNum > player.clansLeft || clansNum !== citadelNum) {
            throw new Error("PeasantsWorkersAction: wrong number of clans")
        }
        if (!gameState.map.HasHexagon(axialToNum.axial)) {
            throw new Error(`PeasantsWorkersAction: no hexagon with axial:${axialToNum.axial}`)
        }
        let hex: Hexagon = gameState.map.GetHex(axialToNum.axial)!
        if (!playerHex.includes(hex)) {
            throw new Error(`PeasantsWorkersAction: player is not present on axial:${axialToNum.axial}`)
        }
        gameState.map.clansController.AddClans(player, axialToNum.num, axialToNum.axial)
    }
}
export function SanctuaryAction({ gameState, player, axial }: ICardOperationParams): void {
    if (Array.isArray(axial) || axial === undefined || typeof axial !== 'object') {
        throw new Error(`SanctuaryAction: axial field error`)
    }
    if (gameState.map.fieldsController.sanctuariesLeft <= 0) {
        throw new Error(`SanctuaryAction: no sancturies left`)
    }
    const map: HexGrid = gameState.map
    if (!gameState.map.GetHex(axial)) {
        throw new Error(`PeasantsWorkersAction: no hexagon with axial:${axial}`)
    }
    const hex: Hexagon = map.GetHex(axial)!
    const playerHex: Hexagon[] = map.fieldsController.GetPlayerHex(player)!
    if (!playerHex.includes(hex)) {
        throw new Error(`PeasantsWorkersAction: player is not present on axial:${axial}`)
    }
    gameState.map.fieldsController.sanctuariesLeft--
    hex.field.sanctuaryCount++
    //Add Epos card to player
}
export function CitadelAction({ gameState, player, axial }: ICardOperationParams): void {
    if (Array.isArray(axial) || axial === undefined || typeof axial !== 'object') {
        throw new Error(`CitadelAction: axial field error`)
    }
    if (gameState.map.fieldsController.citadelsLeft <= 0) {
        throw new Error(`CitadelAction: no citadels left`)
    }
    if (!gameState.map.HasHexagon(axial)) {
        throw new Error(`PeasantsWorkersAction: no hexagon with axial:${axial}`)
    }
    const hex: Hexagon = gameState.map.GetHex(axial)!
    const playerHex: Hexagon[] = gameState.map.fieldsController.GetPlayerHex(player)!
    if (!playerHex.includes(hex)) {
        throw new Error(`PeasantsWorkersAction: player is not present on axial:${axial}`)
    }
    gameState.map.fieldsController.citadelsLeft--
    hex.field.citadelsCount++
    //Add Advantage card to player if possible
}
export function NewClansAction({ gameState, player, axial }: ICardOperationParams): void {
    if (!axial) {
        throw new Error(`NewClansAction: axial field error`)
    }
    if (Array.isArray(axial)) {
        if (axial.length !== 2) {
            throw new Error(`NewClansAction: axial array length error`)
        }
        if (!gameState.map.HasHexagon(axial[0])) {
            throw new Error(`NewClansAction: no hexagon with axial:${axial[0]}`)
        }
        if (!gameState.map.HasHexagon(axial[1])) {
            throw new Error(`NewClansAction: no hexagon with axial:${axial[1]}`)
        }
        const hex1: Hexagon = gameState.map.GetHex(axial[0])!
        const hex2: Hexagon = gameState.map.GetHex(axial[1])!
        const playerHex: Hexagon[] = gameState.map.fieldsController.GetPlayerHex(player)!
        if (!playerHex.includes(hex1)) {
            throw new Error(`NewClansAction: player is not present on axial:${axial[0]}`)
        }
        if (!playerHex.includes(hex2)) {
            throw new Error(`NewClansAction: player is not present on axial:${axial[1]}`)
        }
        gameState.map.clansController.AddClans(player, 1, axial[0])
        gameState.map.clansController.AddClans(player, 1, axial[1])
    }

    if (typeof axial === 'object' && !Array.isArray(axial)) {
        if (!gameState.map.HasHexagon(axial)) {
            throw new Error(`NewClansAction: no hexagon with axial:${axial}`)
        }
        const hex: Hexagon = gameState.map.GetHex(axial)!
        const playerHex: Hexagon[] = gameState.map.fieldsController.GetPlayerHex(player)!
        if (!playerHex.includes(hex)) {
            throw new Error(`NewClansAction: player is not present on axial:${axial}`)
        }
        gameState.map.clansController.AddClans(player, 2, axial)
    }

}
export function ExplorationAction({ gameState, player, axial }: ICardOperationParams): void {
    if (!axial || typeof axial !== 'object' || Array.isArray(axial)) {
        throw new Error(`ExplorationAction: axial field error`)
    }
    if (!gameState.map.HasHexagon(axial)) {
        throw new Error(`ExplorationAction: no hexagon with axial:${axial}`)
    }
    gameState.map.fieldsController.AddRandomField(axial)
    gameState.map.clansController.AddClans(player, 1, axial)
}
export function HolidayAction({ gameState, player, axial }: ICardOperationParams): void {
    if (!axial || typeof axial !== `object` || Array.isArray(axial)) {
        throw new Error(`HolidayAction: axial field error`)
    }
    if (!gameState.map.HasHexagon(axial)) {
        throw new Error(`HolidayAction: no hexagon with axial:${axial}`)
    }
    const hex: Hexagon = gameState.map.GetHex(axial)!
    const hexArr: Hexagon[] = gameState.map.fieldsController.GetPlayerHex(player)!
    if (!hexArr.includes(hex)) {
        throw new Error(`HolidayAction: player is not present on axial:${axial}`)
    }
    if (hex.field.sanctuaryCount === 0) {
        throw new Error(`HolidayAction: no sanctuaries`)
    }
    gameState.map.clansController.AddClans(player, 1, axial)
    gameState.map.fieldsController.SetHolidayField(axial)
}
export function ConquestAction({ gameState, player, axial: singleAxial, axialToNum: axialToNum }: ICardOperationParams): void {
    //validate data
    if (!singleAxial || typeof singleAxial !== `object` || Array.isArray(singleAxial)) {
        throw new Error(`ConquestAction: targetAxial field error`)
    }
    if (!axialToNum) {
        throw new Error(`ConquestAction: targetAxial field error`)
    }
    if (!gameState.map.HasHexagon(singleAxial)) {
        throw new Error(`ConquestAction: no hexagon with axial:${singleAxial}`)
    }
    //validate hexagons
    const playerHex: Hexagon[] = gameState.map.fieldsController.GetPlayerHex(player)!
    const hexNeighbours: Hexagon[] = gameState.map.GetNeighbors({ q: singleAxial.q, r: singleAxial.r })
    const targetHexagon: Hexagon = gameState.map.GetHex(singleAxial)!
    if (Array.isArray(axialToNum)) {
        for (const ax of axialToNum) {
            if (!gameState.map.HasHexagon(ax.axial)) {
                throw new Error(`ConquestAction: no hexagon with axial:${ax.axial}`)
            }
            let hex: Hexagon = gameState.map.GetHex(ax.axial)!
            if (!playerHex.includes(hex)) {
                throw new Error(`ConquestAction: player is not present on axial:${ax.axial}`)
            }
            if (!hexNeighbours.includes(hex)) {
                throw new Error(`ConquestAction: the axial:${ax.axial}, is not a neighbour`)
            }
            //Check clans
            if (!hex.field.playersClans.has(player.id)) {
                throw new Error(`ConquestAction: player dosen't have clans on axial:${ax.axial}`)
            }
            if (hex.field.playersClans.get(player.id)! < ax.num) {
                throw new Error(`ConquestAction:player dosen't have enough clans on the axial:${ax.axial}`)
            }
        }
        for (const ax of axialToNum) {
            gameState.map.clansController.MoveClans(player, ax.axial, singleAxial, ax.num)
        }
    }
    else if (typeof axialToNum === 'object' && !Array.isArray(axialToNum)) {
        if (!gameState.map.HasHexagon(axialToNum.axial)) {
            throw new Error(`ConquestAction: no hexagon with axial:${axialToNum.axial}`)
        }
        let hex: Hexagon = gameState.map.GetHex(axialToNum.axial)!
        if (!playerHex.includes(hex)) {
            throw new Error(`ConquestAction: player is not present on axial:${axialToNum.axial}`)
        }
        if (!hexNeighbours.includes(hex)) {
            throw new Error(`ConquestAction: the axial:${axialToNum.axial}, is not a neighbour`)
        }
        //Check clans
        if (!hex.field.playersClans.has(player.id)) {
            throw new Error(`ConquestAction: player dosen't have clans on axial:${axialToNum.axial}`)
        }
        if (hex.field.playersClans.get(player.id)! < axialToNum.num) {
            throw new Error(`ConquestAction:player dosen't have enough clans on the axial:${axialToNum.axial}`)
        }
        gameState.map.clansController.MoveClans(player, axialToNum.axial, singleAxial, axialToNum.num)
    }
    if (targetHexagon.field.playersClans.size > 1) {
        gameState.fightManager.InitFight(player, targetHexagon)
    }
}