import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { HttpError } from "../errors/http.error.js";
import { RestaurantService } from "../services/restaurant.service.js";

const restaurantService = new RestaurantService();

export class RestaurantController {
  // 업장 ID로 업장 조회 메서드
  async getRestaurantById(req, res, next) {
    try {
      const restaurantId = parseInt(req.params.restaurantId); // 요청 파라미터에서 업장 ID 가져오기

      if (isNaN(restaurantId)) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({
            status: HTTP_STATUS.BAD_REQUEST,
            errorMessage: "유효한 업장 ID를 입력해주세요.",
          }); // 유효하지 않은 ID 처리
      }

      const restaurant =
        await restaurantService.getRestaurantById(restaurantId); // 업장 조회
      if (!restaurant) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({
            status: HTTP_STATUS.NOT_FOUND,
            errorMessage: "업장을 찾을 수 없습니다.",
          }); // 업장을 찾지 못한 경우
      }

      // 업장 정보 반환
      res.status(200).json({
        status: 200,
        data: {
          restaurantId: restaurant.restaurantId,
          ownerId: restaurant.ownerId,
          restaurantName: restaurant.name,
          restaurantPhoneNumber: restaurant.phoneNumber,
          restaurantCity: restaurant.cityAddress,
          restaurantStreetAddress: restaurant.streetAddress,
          restaurantDetailAddress: restaurant.detailAddress,
          mainFoodType: restaurant.mainMenuType,
          deliveryAvailableArea: restaurant.deliveryAvailableArea,
          createdAt: restaurant.createdAt,
          updatedAt: restaurant.updatedAt,
        },
      });
    } catch (error) {
      next(error); // 에러 처리
    }
  }

  // 업장 생성 메서드
  async createRestaurant(req, res, next) {
    try {
      const { userId, role } = req.user;
      const ownerId = userId;
      const {
        restaurantName,
        restaurantPhoneNumber,
        restaurantCity,
        restaurantStreetAddress,
        restaurantDetailAddress,
        mainFoodType,
        deliveryAvailableArea,
      } = req.body; // 요청 본문에서 데이터 가져오기

      const newRestaurant = await restaurantService.createRestaurant(
        ownerId,
        role,
        restaurantName,
        restaurantPhoneNumber,
        restaurantCity,
        restaurantStreetAddress,
        restaurantDetailAddress,
        mainFoodType,
        deliveryAvailableArea,
      ); // 업장 생성

      // 생성된 업장 정보 반환
      res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: "업장 생성 성공",
        data: {
          ownerId: newRestaurant.ownerId,
          restaurantId: newRestaurant.restaurantId,
          restaurantName: newRestaurant.name,
          restaurantPhoneNumber: newRestaurant.phoneNumber,
          restaurantCity: newRestaurant.cityAddress,
          restaurantStreetAddress: newRestaurant.streetAddress,
          restaurantDetailAddress: newRestaurant.detailAddress,
          mainFoodType: newRestaurant.mainMenuType,
          deliveryAvailableArea: newRestaurant.deliveryAvailableArea,
          createdAt: newRestaurant.createdAt,
          updatedAt: newRestaurant.updatedAt,
        },
      });
    } catch (error) {
      next(error); // 에러 처리
    }
  }

  // 업장 수정 메서드
  async updateRestaurant(req, res, next) {
    try {
      const { userId } = req.user;
      const restaurantId = parseInt(req.params.restaurantId); // 요청 파라미터에서 업장 ID 가져오기

      const {
        restaurantName,
        restaurantPhoneNumber,
        restaurantCity,
        restaurantStreetAddress,
        restaurantDetailAddress,
        mainFoodType,
        deliveryAvailableArea,
      } = req.body; // 요청 본문에서 데이터 가져오기

      // if (!restaurantName && !restaurantPhoneNumber && !restaurantCity  && !restaurantStreetAddress && !restaurantDetailAddress && !mainFoodType && deliveryAvailableArea){
      //   return res.status(HttpError.BadRequest).json({
      //     message: '수정 할 정보를 입력해 주세요.',
      //   });
      // };

      const updatedRestaurant = await restaurantService.updateRestaurant(
        userId,
        restaurantId,
        restaurantName,
        restaurantPhoneNumber,
        restaurantCity,
        restaurantStreetAddress,
        restaurantDetailAddress,
        mainFoodType,
        deliveryAvailableArea,
      ); // 업장 수정

      if (!updatedRestaurant) {
        return res
          .status(HTTP_STATUS.CREATED)
          .json({
            status: HTTP_STATUS.CREATED,
            errorMessage: "업장을 찾을 수 없습니다.",
          }); // 업장을 찾지 못한 경우
      }

      // 수정된 업장 정보 반환
      res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: "업장 수정 성공",
        data: {
          restaurantId: updatedRestaurant.restaurantId,
          restaurantName: updatedRestaurant.name,
          restaurantPhoneNumber: updatedRestaurant.phoneNumber,
          restaurantCity: updatedRestaurant.cityAddress,
          restaurantStreetAddress: updatedRestaurant.streetAddress,
          restaurantDetailAddress: updatedRestaurant.detailAddress,
          mainFoodType: updatedRestaurant.mainMenuType,
          deliveryAvailableArea: updatedRestaurant.deliveryAvailableArea,
          createdAt: updatedRestaurant.createdAt,
          updatedAt: updatedRestaurant.updatedAt,
        },
      });
    } catch (error) {
      next(error); // 에러 처리
    }
  }

  // 업장 삭제 메서드
  async deleteRestaurant(req, res, next) {
    try {
      const { userId } = req.user;
      const restaurantId = parseInt(req.params.restaurantId); // 요청 파라미터에서 업장 ID 가져오기

      const deleted = await restaurantService.deleteRestaurant(
        userId,
        restaurantId,
      ); // 업장 삭제

      if (deleted) {
        res
          .status(HTTP_STATUS.OK)
          .json({ status: HTTP_STATUS.OK, message: "업장 삭제 성공" }); // 삭제 성공
      } else {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          status: HTTP_STATUS.NOT_FOUND,
          errorMessage: "업장을 찾을 수 없습니다.",
        }); // 업장을 찾지 못한 경우
      }
    } catch (error) {
      next(error); // 에러 처리
    }
  }

  //레스토랑의 주문내역 조회
  readOrder = async (req, res, next) => {
    try {
      const { userId, role } = req.user;
      const ownerId = userId;

      const order = await restaurantService.readOrder(ownerId, role);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: "레스토랑의 주문 내역입니다.",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  };

  //업장 검색
  searchRestaurant = async (req, res, next) => {
    try {
      const { searchWord } = req.body;

      const [type, keyWord] = await restaurantService.findMenuType(searchWord);

      const restaurant = await restaurantService.searchRestaurant(
        type,
        keyWord,
      );

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: "검색 결과입니다.",
        data: restaurant,
      });
    } catch (error) {
      next(error);
    }
  };
}
