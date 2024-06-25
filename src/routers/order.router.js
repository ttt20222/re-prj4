import express from "express";
import { OrderController } from "../controllers/order.controller.js";
import { requireAccessToken } from "../middlewares/require-access-token.middleware.js";

const router = express.Router();

const orderController = new OrderController();

router.post("/", requireAccessToken, orderController.createOrder);
router.get("/", requireAccessToken, orderController.readOrders);
router.patch(
  "/:orderId",
  requireAccessToken,
  orderController.updateOrderStatus,
);

export default router;
