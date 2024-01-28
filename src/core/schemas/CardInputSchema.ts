import Joi from "joi";
import { IPlayerCardInput } from "../../types/Interfaces";
import { cardParamsSchema } from "./CardParamsSchema";

const cardInputSchema = Joi.object<IPlayerCardInput>({
    cardId: Joi.string().required(),
    params: cardParamsSchema
})
export { cardInputSchema }