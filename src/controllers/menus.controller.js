import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { MenusService } from "../services/menus.service.js";
import { MESSAGES } from "../constants/message.constant.js";

export class MenusController {
  menusService = new MenusService();
  create = async (req, res, next) => {
    try {
      const { role } = req.user;
      //path parameters에서 restaurantId 추출
      const { restaurantId } = req.params;
      //req.body에서 데이터 추출
      const { menuName, menuPrice, menuType, menuDescription } = req.body;
      //업로드된 파일의 S3 URL을 menuImageUrl 변수에 할당
      const menuImageUrl = req.files ? req.files[0].location : "";

      const menu = await this.menusService.create(
        restaurantId,
        menuName,
        menuPrice,
        menuType,
        menuDescription,
        menuImageUrl,
        role,
      );

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.MENUS.CREATE.SUCCEED,
        menu,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  readAll = async (req, res, next) => {
    try {
      //path parameters에서 restaurantId 추출
      const { restaurantId } = req.params;
      const menus = await this.menusService.readAll(restaurantId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.MENUS.READ_LIST.SUCCEED,
        menus,
      });
    } catch (err) {
      next(err);
    }
  };

  readById = async (req, res, next) => {
    try {
      //path parameters에서 restaurantId, menuId 추출
      const { restaurantId, menuId } = req.params;

      const menu = await this.menusService.readById(restaurantId, menuId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.MENUS.READ_DETAIL.SUCCEED,
        menu,
      });
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const { role } = req.user;
      //path parameters에서 restaurantId 추출
      const { restaurantId, menuId } = req.params;
      //req.body에서 데이터 추출
      const { menuName, menuPrice, menuType, menuDescription } = req.body;

      //업로드된 파일의 S3 URL을 menuImageUrl 변수에 할당
      const menuImageUrl = req.files[0].location;

      const updatedMenu = await this.menusService.update(
        restaurantId,
        menuId,
        menuName,
        menuPrice,
        menuType,
        menuDescription,
        menuImageUrl,
        role,
      );

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.MENUS.UPDATE.SUCCEED,
        updatedMenu,
      });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { role } = req.user;
      //path parameters에서 restaurantId 추출
      const { menuId, restaurantId } = req.params;

      await this.menusService.delete(menuId, restaurantId, role);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.MENUS.DELETE.SUCCEED,
      });
    } catch (err) {
      next(err);
    }
  };
}
