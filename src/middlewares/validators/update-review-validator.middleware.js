import Joi from "joi";
import { MESSAGES } from "../../constants/message.constant.js";

const schema = Joi.object({
  //   orderId, score, review
  orderId: Joi.number().required().messages({
    "any.required": MESSAGES.REVIEWS.CREATE.NO_ORDER_ID,
  }),
  score: Joi.number().required().messages({
    "any.required": MESSAGES.REVIEWS.CREATE.NO_SCORE,
  }),
  review: Joi.string().required().messages({
    "any.required": MESSAGES.REVIEWS.CREATE.NO_REVIEW,
  }),
});

export const updateReviewValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    next(err);
  }
};
