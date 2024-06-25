import express from "express";
import { CartController } from "../controllers/cart.controller.js";
import { requireAccessToken } from "../middlewares/require-access-token.middleware.js";

const router = express.Router();

const cartController = new CartController();

router.post("/", requireAccessToken, cartController.createCart);
router.get("/", requireAccessToken, cartController.readCart);
router.patch(
  "/menus/:menusId",
  requireAccessToken,
  cartController.updateCartMenuCount,
);
router.delete(
  "/menus/:menusId",
  requireAccessToken,
  cartController.deleteCartMenu,
);

export default router;
