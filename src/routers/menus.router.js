import express from "express";
import { toS3 } from "../middlewares/multer.middleware.js";
import { MenusController } from "../controllers/menus.controller.js";
import { createMenuValidator } from "../middlewares/validators/create-menu-validator.middleware.js";
import { updateMenuValidator } from "../middlewares/validators/update-menu-validator.middleware.js";
import { requireAccessToken } from "../middlewares/require-access-token.middleware.js";

const menusRouter = express.Router();
const menusController = new MenusController();

//메뉴 생성
menusRouter.post(
  "/:restaurantId/menus",
  requireAccessToken,
  toS3.array("files", 1),
  createMenuValidator,
  menusController.create,
);

//메뉴 목록 조회
menusRouter.get("/:restaurantId/menus", menusController.readAll);

//메뉴 상세 조회
menusRouter.get("/:restaurantId/menus/:menuId", menusController.readById);

//메뉴 수정
menusRouter.patch(
  "/:restaurantId/menus/:menuId",
  requireAccessToken,
  toS3.array("files", 1),
  updateMenuValidator,
  menusController.update,
);

// //메뉴 삭제
menusRouter.delete(
  "/:restaurantId/menus/:menuId",
  requireAccessToken,
  menusController.delete,
);

export { menusRouter };
