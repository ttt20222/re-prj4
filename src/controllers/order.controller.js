import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { OrderService } from "../services/order.service.js";

const orderService = new OrderService();

export class OrderController {
  //주문생성
  createOrder = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { userRequirment } = req.body;

      const order = await orderService.createOrder(userId, userRequirment);

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: "주문에 성공하였습니다.",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  };

  //주문조회
  readOrders = async (req, res, next) => {
    try {
      const { userId } = req.user;

      const orders = await orderService.readOrders(userId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: "내 주문 조회에 성공하였습니다.",
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  };

  //주문상태변경
  updateOrderStatus = async (req, res, next) => {
    try {
      const params = req.params;
      const orderId = params.orderId;

      const newOrders = await orderService.updateOrderStatus(orderId);

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: "주문 상태를 배달완료(DONE)로 변경하였습니다.",
        data: newOrders,
      });
    } catch (error) {
      next(error);
    }
  };
}
