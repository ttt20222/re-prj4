import Joi from "joi";
import { MESSAGES } from "../../constants/message.constant.js";
import { Role } from "@prisma/client";

const schema = Joi.object({
  userId: Joi.number().required().messages({
    "any.required": MESSAGES.ADMIN.COMMON.USERID.REQUIRED,
  }),
  name: Joi.string().required().messages({
    "any.required": MESSAGES.ADMIN.COMMON.NAME.REQUIRED,
  }),
  role: Joi.string()
    .valid(...Object.values(Role))
    .messages({
      "any.required": MESSAGES.ADMIN.COMMON.ROLE.REQUIRED,
      "any.only": MESSAGES.ADMIN.COMMON.ROLE.INVALID,
    }),
});

export const adminValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    next(err);
  }
};
