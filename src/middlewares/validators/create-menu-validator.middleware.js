import Joi from "joi";
import { MESSAGES } from "../../constants/message.constant.js";

const schema = Joi.object({
  menuName: Joi.string().required().messages({
    "any.required": MESSAGES.MENUS.COMMON.MENUMANE.REQUIRED,
  }),
  menuPrice: Joi.number().required().messages({
    "any.required": MESSAGES.MENUS.COMMON.MENUPRICE.REQUIRED,
  }),
  menuType: Joi.number().valid(1, 2, 3).required().messages({
    "any.required": MESSAGES.MENUS.COMMON.MENUTYPE.REQUIRED,
    "any.only": MESSAGES.MENUS.COMMON.MENUTYPE.INVALID,
  }),
  menuDescription: Joi.string().min(8).required().messages({
    "any.required": MESSAGES.MENUS.COMMON.MENUDESCRIPTION.REQUIRED,
    "string.min": MESSAGES.MENUS.COMMON.MENUDESCRIPTION.MIN_LENGTH,
  }),
  menuImageUrl: Joi.string(),
});

export const createMenuValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    next(err);
  }
};
