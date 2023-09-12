 export enum StartStructure{
    Shrine
 }
 export type Territory = {
    id:string
    title:string
    description: string | undefined
    cardId:string
    startStructure: StartStructure | undefined
 }