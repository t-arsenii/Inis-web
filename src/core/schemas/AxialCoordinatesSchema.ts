import { axialCoordinates } from "../../types/Types";
import Joi from "joi";

const axialCoordinatesSchema = Joi.object<axialCoordinates>({
    q: Joi.number().required(),
    r: Joi.number().required()
})
export { axialCoordinatesSchema }