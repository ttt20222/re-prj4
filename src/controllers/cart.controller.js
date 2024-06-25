import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { CartService } from "../services/cart.service.js";

const cartService = new CartService();

export class CartController {
  //장바구니 상품 추가
  createCart = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { restaurantId, menuId, menuCount } = req.body;

      const cart = await cartService.createCartDetail(
        userId,
        restaurantId,
        menuId,
        menuCount,
      );

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: "장바구니에 메뉴가 추가되었습니다.",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  };

  //장바구니 목록 조회
  readCart = async (req, res, next) => {
    try {
      const { userId } = req.user;

      const cart = await cartService.readCarts(userId);

      return res.status(HTTP_STATUS.OK).json({
        staus: HTTP_STATUS.OK,
        message: "내 장바구니 목록 조회입니다.",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  };

  //장바구니 메뉴 수량 수정
  updateCartMenuCount = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { menuCount } = req.body;
      const params = req.params;
      const menuId = params.menusId;

      const cart = await cartService.updateCartMenuCount(
        userId,
        menuCount,
        menuId,
      );

      return res.status(HTTP_STATUS.CREATED).json({
        staus: HTTP_STATUS.OK,
        message: "내 장바구니 메뉴 수량 수정에 성공했습니다.",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  };

  //장바구니 메뉴 삭제
  deleteCartMenu = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const params = req.params;
      const menuId = params.menusId;

      const cart = await cartService.deleteCartMenu(userId, menuId);

      return res.status(HTTP_STATUS.CREATED).json({
        staus: HTTP_STATUS.OK,
        message: "내 장바구니 메뉴 삭제에 성공했습니다.",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  };
}
