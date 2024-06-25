import Joi from 'joi';
import { MESSAGES } from "../../constants/message.constant.js";
import { validDeliveryAreas } from '../../constants/delivery.area.js';

const schema = Joi.object({
  restaurantPhoneNumber: Joi.string().pattern(/^\d{3}-\d{3,4}-\d{4}$/).messages({
    "string.pattern.base": MESSAGES.RESTAURANTS.UPDATE.COMMON.NUMBER.INVALID,
  }),
  mainFoodType: Joi.string().valid('양식','중식','일식','한식','분식','아시안식','디저트','패스트푸드').messages({
    "any.only": MESSAGES.RESTAURANTS.UPDATE.COMMON.FOODTYPE.INVALID,
  }),
  deliveryAvailableArea: Joi.string().valid(...validDeliveryAreas).messages({
    "any.only": MESSAGES.RESTAURANTS.UPDATE.COMMON.DELEVERYAREA.INVALID,
  }),
});

export const updateRestaurantValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    next(err);
  }
};
