import { HttpError } from "../errors/http.error.js";
import { CartRepository } from "../repositories/cart.repository.js";

const cartRepository = new CartRepository();

export class CartService {
  //메뉴 담기
  createCartDetail = async (userId, restaurantId, menuId, menuCount) => {
    const cart = await cartRepository.createCartDetail(
      userId,
      restaurantId,
      menuId,
      menuCount,
    );
    return cart;
  };

  //카트에 담긴 메뉴 조회
  readCarts = async (userId) => {
    const readCarts = await cartRepository.readCarts(userId);

    if (readCarts.length === 0) {
      throw new HttpError.BadRequest("장바구니에 메뉴가 존재하지 않습니다.");
    }

    const returnCarts = readCarts.map((item) => ({
      menuId: item.MenuId,
      menuName: item.Menu.menuName,
      menuPrice: item.Menu.menuPrice,
      menuCount: item.menuCount,
    }));

    return returnCarts;
  };

  //메뉴 수량 업데이트
  updateCartMenuCount = async (userId, menuCount, menuId) => {
    if (menuCount === 0) {
      throw new HttpError.BadRequest("메뉴의 최소 수량은 1개 입니다.");
    }

    const updateCart = await cartRepository.updateCartDetail(
      userId,
      menuCount,
      menuId,
    );

    if (!updateCart) {
      throw new HttpError.BadRequest("해당 메뉴가 존재하지 않습니다.");
    }

    const returnCarts = await this.readCarts(userId);

    return returnCarts;
  };

  //메뉴삭제
  deleteCartMenu = async (userId, menuId) => {
    const deleteCartMenu = await cartRepository.deleteCartMenu(userId, menuId);

    if (!deleteCartMenu) {
      throw new HttpError.BadRequest("해당 메뉴가 존재하지 않습니다.");
    }

    return deleteCartMenu.MenuId;
  };
}
