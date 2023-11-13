import Joi from "joi";
import { ICardParams } from "../../types/Interfaces";
import { axialCoordinatesSchema } from "./AxialCoordinatesSchema";

const cardParamsSchema = Joi.object<ICardParams>({
    axial: Joi.array().items(axialCoordinatesSchema),
    singleAxial: axialCoordinatesSchema,
    targetPlayerId: Joi.string(),
    axialToNum: Joi.array().items({ axial: axialCoordinatesSchema.required(), num: Joi.number().required() }),
    targetCardId: Joi.string(),
    cardVariation: Joi.number().min(1).max(2)
})
export { cardParamsSchema }