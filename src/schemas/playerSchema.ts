import Joi from "joi"

const playerSchema = Joi.object({
    id: Joi.string().required(),
    username: Joi.string().required(),
    color: Joi.string().required(),
    mmr: Joi.number().required()
});

export { playerSchema }