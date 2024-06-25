import { prisma } from "../utils/prisma/index.js";

export class MenusRepository {
  create = async (
    restaurantId,
    menuName,
    menuPrice,
    menuType,
    menuDescription,
    menuImageUrl,
  ) => {
    const createdMenu = await prisma.menu.create({
      data: {
        menuName,
        menuPrice: +menuPrice,
        menuType: +menuType,
        menuDescription,
        menuImageUrl,
        Restaurant: { connect: { restaurantId: +restaurantId } },
      },
    });
    return createdMenu;
  };

  findByMenuName = async (restaurantId, menuName) => {
    const existedMenuName = await prisma.menu.findFirst({
      where: { restaurantId: +restaurantId, menuName },
      select: {
        menuId: true,
        menuName: true,
        menuPrice: true,
        menuType: true,
        menuDescription: true,
        menuImageUrl: true,
      },
    });
    return existedMenuName;
  };

  readAll = async (restaurantId) => {
    let menus = await prisma.menu.findMany({
      where: { restaurantId: +restaurantId },
      //메뉴타입 오름차순, 가격 오름차순 정렬
      orderBy: [{ menuType: "asc" }, { menuPrice: "asc" }],
    });

    menus = menus.map((menu) => {
      return {
        menuId: menu.menuId,
        menuName: menu.menuName,
        menuPrice: menu.menuPrice,
        menuType: menu.menuType,
        menuDescription: menu.menuDescription,
        menuImageUrl: menu.menuImageUrl,
        createdAt: menu.createdAt,
        updatedAt: menu.updatedAt,
      };
    });
    return menus;
  };

  readById = async (restaurantId, menuId) => {
    let menu = await prisma.menu.findUnique({
      where: { restaurantId: +restaurantId, menuId: +menuId },
    });

    if (!menu) {
      return null; // 존재하지 않는 경우 null을 반환하도록
    }

    menu = {
      menuId: menu.menuId,
      menuName: menu.menuName,
      menuPrice: menu.menuPrice,
      menuType: menu.menuType,
      menuDescription: menu.menuDescription,
      menuImageUrl: menu.menuImageUrl,
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
    };

    return menu;
  };

  update = async (
    restaurantId,
    menuId,
    menuName,
    menuPrice,
    menuType,
    menuDescription,
    menuImageUrl,
  ) => {
    const updatedMenu = await prisma.menu.update({
      where: { menuId: +menuId },
      data: {
        menuName,
        menuPrice,
        menuType,
        menuDescription,
        menuImageUrl,
        restaurantId: +restaurantId,
      },
    });
    return updatedMenu;
  };

  delete = async (menuId, restaurantId) => {
    const deletedMenu = await prisma.menu.delete({
      where: { menuId: +menuId, restaurantId: +restaurantId },
    });
    return deletedMenu;
  };
}
