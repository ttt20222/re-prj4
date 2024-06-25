import { MenusRepository } from "../repositories/menus.repository.js";
import { HttpError } from "../errors/http.error.js";
import { MESSAGES } from "../constants/message.constant.js";
import { MENU_TYPES } from "../constants/menu.type.js";

export class MenusService {
  menusRepository = new MenusRepository();

  create = async (
    restaurantId,
    menuName,
    menuPrice,
    menuType,
    menuDescription,
    menuImageUrl,
    role,
  ) => {
    //사장님만 자기 업장의 주문 상태를 볼 수 있음.
    if (role != "OWNER") {
      throw new HttpError.Forbidden("사장님이 아닙니다.");
    }

    // 이미 존재하는 메뉴 이름인지 체크
    const existedMenuName = await this.menusRepository.findByMenuName(
      restaurantId,
      menuName,
    );
    // 동일 이름이 존재할 시 에러
    if (existedMenuName) {
      throw new HttpError.BadRequest(MESSAGES.MENUS.COMMON.NAME_ALREADY_EXISTS);
    }

    //메뉴 생성
    const createdMenu = await this.menusRepository.create(
      restaurantId,
      menuName,
      menuPrice,
      menuType,
      menuDescription,
      menuImageUrl,
    );

    const formattedMenu = this.formatMenuForOutput(createdMenu);

    return formattedMenu;
  };

  readAll = async (restaurantId) => {
    const menus = await this.menusRepository.readAll(restaurantId);

    const formattedMenus = menus.map((menu) => this.formatMenuForOutput(menu));

    return formattedMenus;
  };

  readById = async (restaurantId, menuId) => {
    const menu = await this.menusRepository.readById(restaurantId, menuId);

    //존재하는 메뉴인지 확인
    if (!menu) {
      throw new HttpError.NotFound(MESSAGES.MENUS.COMMON.NOT_FOUND);
    }

    const formattedMenu = this.formatMenuForOutput(menu);

    return formattedMenu;
  };

  //메뉴 타입 변환 메서드
  formatMenuForOutput(menu) {
    return {
      ...menu,
      menuType: MENU_TYPES[menu.menuType],
    };
  }
  update = async (
    restaurantId,
    menuId,
    menuName,
    menuPrice,
    menuType,
    menuDescription,
    menuImageUrl,
    role,
  ) => {
    //사장님만 자기 업장의 주문 상태를 볼 수 있음.
    if (role != "OWNER") {
      throw new HttpError.Forbidden("사장님이 아닙니다.");
    }

    const existedMenu = await this.menusRepository.readById(
      restaurantId,
      menuId,
    );

    //존재하는 메뉴인지 확인
    if (!existedMenu) {
      throw new HttpError.NotFound(MESSAGES.MENUS.COMMON.NOT_FOUND);
    }

    // 이미 존재하는 메뉴 이름인지 체크
    const existedMenuName = await this.menusRepository.findByMenuName(
      restaurantId,
      menuName,
    );
    if (existedMenuName) {
      throw new HttpError.BadRequest(MESSAGES.MENUS.COMMON.NAME_ALREADY_EXISTS);
    }

    const updatedMenu = await this.menusRepository.update(
      restaurantId,
      menuId,
      menuName,
      menuPrice,
      menuType,
      menuDescription,
      menuImageUrl,
    );
    return updatedMenu;
  };

  delete = async (menuId, restaurantId, role) => {
    //사장님만 자기 업장의 주문 상태를 볼 수 있음.
    if (role != "OWNER") {
      throw new HttpError.Forbidden("사장님이 아닙니다.");
    }

    const existedMenu = await this.menusRepository.readById(
      restaurantId,
      menuId,
    );

    //존재하는 메뉴인지 확인
    if (!existedMenu) {
      throw new HttpError.NotFound(MESSAGES.MENUS.COMMON.NOT_FOUND);
    }

    const deletedMenu = await this.menusRepository.delete(menuId, restaurantId);
    return deletedMenu;
  };
}
