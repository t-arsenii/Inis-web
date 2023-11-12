import Joi from "joi"
import { MAX_PLAYERS, MIN_PLAYERS } from "../core/constans/constant_game";
import { playerSchema } from "./playerSchema";
const gameSchema = Joi.object({
    numPlayers: Joi.number().min(MIN_PLAYERS).max(MAX_PLAYERS).required(),
    players: Joi.array().items(playerSchema).required()
});

export { gameSchema };