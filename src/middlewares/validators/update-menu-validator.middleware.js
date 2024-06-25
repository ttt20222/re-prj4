import Joi from "joi";
import { MESSAGES } from "../../constants/message.constant.js";

const schema = Joi.object({
  menuName: Joi.string(),
  menuPrice: Joi.number(),
  menuType: Joi.number().valid(1, 2, 3).messages({
    "any.only": MESSAGES.MENUS.COMMON.MENUTYPE.INVALID,
  }),
  menuDescription: Joi.string().min(10).messages({
    "string.min": MESSAGES.MENUS.COMMON.MENUDESCRIPTION.MIN_LENGTH,
  }),
  menuImageUrl: Joi.string(),
});

export const updateMenuValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    next(err);
  }
};
