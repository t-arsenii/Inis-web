import Joi from "joi"
import { MAX_PLAYERS, MIN_PLAYERS } from "../core/constans/constant_game";
import { playerSchema } from "./playerSchema";
const gameSchema = Joi.object({
    players: Joi.array().items(playerSchema).required(),
    settings: {
        numberOfPlayers: Joi.number().min(MIN_PLAYERS).max(MAX_PLAYERS).required(),
        gameSpeed: Joi.string(),
        ranked: Joi.boolean(),
    }
});

export { gameSchema };