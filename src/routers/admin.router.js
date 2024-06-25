import express from "express";
import { AdminController } from "../controllers/admin.controller.js";
import { adminValidator } from "../middlewares/validators/admin-validator.middleware.js";
import { requireAccessToken } from "../middlewares/require-access-token.middleware.js";

const adminRouter = express.Router();
const adminController = new AdminController();

//유저 조회
adminRouter.get("/users", requireAccessToken, adminController.readAll);

//역할 변경
adminRouter.put(
  "/users/roles",
  adminValidator,
  requireAccessToken,
  adminController.update,
);

export { adminRouter };
