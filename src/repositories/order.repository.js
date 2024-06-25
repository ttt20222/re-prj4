import { prisma } from "../utils/prisma/index.js";

export class OrderRepository {
  //주문 생성  (카트 테이블 레스토랑 아이디 비우기 -> 주문테이블 생성 -> 주문디테일 테이블 생성 -> 카드디테일테이블 비우기)
  createOrder = async (userId, userRequirment) => {
    const findCart = await prisma.cart.findFirst({
      where: { userId: userId },
    });

    const findCartDetail = await prisma.cartDetail.findMany({
      where: { cartId: findCart.cartId },
      include: {
        Menu: {
          select: {
            menuPrice: true,
          },
        },
      },
    });

    return await prisma.$transaction(async (tx) => {
      await tx.Cart.update({
        where: { userId: userId },
        data: {
          restaurantId: null,
        },
      });

      const totalPriceResult =
        await tx.$queryRaw
        `SELECT SUM(b.menu_price * a.menu_count) as totalPrice
                FROM cart_details a
                JOIN menus b ON a.menu_id = b.menu_id
                WHERE a.cart_id = ${findCart.cartId}`;

      const totalPrice = totalPriceResult[0]?.totalPrice || 0;

      const createOrder = await tx.Order.create({
        data: {
          userId: userId,
          restaurantId: findCart.restaurantId,
          userRequirment: userRequirment,
          totalPrice: totalPrice,
        },
      });

      const createOrderDetailsPromises = findCartDetail.map((cartDetail) => {
        return tx.OrderDetail.create({
          data: {
            orderId: createOrder.orderId,
            menuId: cartDetail.menuId,
            menuPrice: cartDetail.Menu.menuPrice,
            menuCount: cartDetail.menuCount,
          },
        });
      });

      await Promise.all(createOrderDetailsPromises);

      const deleteCartDetailsPromises = findCartDetail.map((cartDetail) => {
        return tx.CartDetail.delete({
          where: { cartDetailId: cartDetail.cartDetailId },
        });
      });

      await Promise.all(deleteCartDetailsPromises);

      return createOrder;
    });
  };

  //내가 주문한 목록 조회
  readOrders = async (userId) => {
    const orders = await prisma.$queryRaw
    `select a.order_id as orderId
                , a.user_id as userId
                , a.restaurant_id as restaurantId
                ,c.menu_name as menuName
                , b.menu_count as menuCount 
                ,b.menu_price as menuPrice 
                ,a.total_price as totalPrice
                , a.user_requirment as userRequirment
                , a.order_status as orderStatus
                , a.created_at as createdAt
                ,a.updated_at as updatedAt
        from orders a join order_details b
        on a.order_id  = b.order_id
        join menus c
        on b.menu_id = c.menu_id
        where a.user_id = ${userId};`; //userId 부분 변경 필요

    return orders;
  };

  //주문 상태 변경
  updateOrderStatus = async (orderId) => {
    const order = await prisma.Order.update({
      where: { orderId: +orderId },
      data: {
        orderStatus: "DONE",
      },
    });

    return order;
  };

  //주문 찾기
  findeOrder = async (orderId) => {
    const order = await prisma.Order.findFirst({
      where: { orderId: +orderId },
    });

    return order;
  };
}
