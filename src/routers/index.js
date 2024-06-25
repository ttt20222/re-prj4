import express from "express";
import { authRouter } from "./auth.router.js";
import { reviewsRouter } from "./reviews.router.js";
import { menusRouter } from "./menus.router.js";
import { usersRouter } from "./users.router.js";
import CartRouter from "./cart.router.js";
import OrderRouter from "./order.router.js";
import { adminRouter } from "./admin.router.js";
import RestaurantRouter from "./restaurants.router.js";

const apiRouter = express.Router();

apiRouter.use("/admin", adminRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/restaurants", reviewsRouter, menusRouter, RestaurantRouter);
apiRouter.use("/carts", CartRouter);
apiRouter.use("/orders", OrderRouter);

export { apiRouter };
