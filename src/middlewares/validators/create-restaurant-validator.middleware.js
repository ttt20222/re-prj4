import Joi from 'joi';
import { MESSAGES } from "../../constants/message.constant.js";
import { validDeliveryAreas } from '../../constants/delivery.area.js';

const schema = Joi.object({
  restaurantName: Joi.string().required().messages({
    "any.required": MESSAGES.RESTAURANTS.COMMON.NAME.REQUIRED,
  }),
  restaurantPhoneNumber: Joi.string().pattern(/^\d{3}-\d{3,4}-\d{4}$/).required().messages({
    "any.required": MESSAGES.RESTAURANTS.COMMON.NUMBER.REQUIRED,
    "string.pattern.base": MESSAGES.RESTAURANTS.COMMON.NUMBER.INVALID,
  }),
  restaurantCity: Joi.string().required().messages({
    "any.required": MESSAGES.RESTAURANTS.COMMON.CITY.REQUIRED,
  }),
  restaurantStreetAddress: Joi.string().required().messages({
    "any.required": MESSAGES.RESTAURANTS.COMMON.STREETADDRESS.REQUIRED,
  }), 
  restaurantDetailAddress: Joi.string().required().messages({
    "any.required": MESSAGES.RESTAURANTS.COMMON.DETAILADDRESS.REQUIRED,
  }),
  mainFoodType: Joi.string().valid('양식','중식','일식','한식','분식','아시안식','디저트','패스트푸드').required().messages({
    "any.required": MESSAGES.RESTAURANTS.COMMON.FOODTYPE.REQUIRED,
    "any.only": MESSAGES.RESTAURANTS.COMMON.FOODTYPE.INVALID,
  }),
  deliveryAvailableArea: Joi.string().valid(...validDeliveryAreas).required().messages({
    "any.required": MESSAGES.RESTAURANTS.COMMON.DELEVERYAREA.REQUIRED,
    "any.only": MESSAGES.RESTAURANTS.COMMON.DELEVERYAREA.INVALID,
  }),
});

export const createRestaurantValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    next(err);
  }
};