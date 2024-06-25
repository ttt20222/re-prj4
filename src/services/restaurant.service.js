import { HttpError } from "../errors/http.error.js";
import { RestaurantRepository } from "../repositories/restaurant.repository.js";
import { mainMenuTypes } from "../constants/main-menu.type.js";

const restaurantRepository = new RestaurantRepository(); // RestaurantRepository 인스턴스 생성
export class RestaurantService {
  //레스토랑 주문내역 조회
  readOrder = async (userId, role) => {
    //사장님만 자기 업장의 주문 상태를 볼 수 있음.
    if (role != "OWNER") {
      throw new HttpError.Forbidden("사장님이 아닙니다.");
    }

    const orders = await restaurantRepository.findOrders(userId);

    return orders.map((order) => ({
      orderId: order.orderId,
      userId: order.userId,
      restaurantId: order.restaurantId,
      userRequirment: order.userRequirment,
      orderStatus: order.orderStatus,
      totalPrice: order.totalPrice,
      menuId: order.menuId,
      menuName: order.menuName,
      menuPrice: order.menuPrice,
      menuCount: order.menuCount,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
  };

  // 특정 업장 조회 서비스 메소드
  async getRestaurantById(restaurantId) {
    const restaurant =
      await restaurantRepository.getRestaurantById(restaurantId); // 레스토랑 ID로 조회

    return restaurant;
  }

  // 업장 생성 서비스 메소드
  async createRestaurant(
    ownerId,
    role,
    restaurantName,
    restaurantPhoneNumber,
    restaurantCity,
    restaurantAddress,
    restaurantStreetAddress,
    restaurantDetailAddress,
    mainFoodType,
    deliveryAvailableArea,
  ) {
    //사장님만 업장 생성 가능
    if (role != "OWNER") {
      throw new HttpError.Forbidden("사장님만 업장을 생성할 수 있습니다.");
    }

    const newRestaurant = await restaurantRepository.createRestaurant(
      ownerId,
      restaurantName,
      restaurantPhoneNumber,
      restaurantCity,
      restaurantAddress,
      restaurantStreetAddress,
      restaurantDetailAddress,
      mainFoodType,
      deliveryAvailableArea,
    ); // 새로운 레스토랑 생성

    return newRestaurant;
  }

  // 업장 수정 서비스 메소드
  async updateRestaurant(
    userId,
    restaurantId,
    restaurantName,
    restaurantPhoneNumber,
    restaurantCity,
    restaurantAddress,
    restaurantStreetAddress,
    restaurantDetailAddress,
    mainFoodType,
    deliveryAvailableArea,
  ) {
    const checkRestaurant =
      await restaurantRepository.getRestaurantById(restaurantId);
    //자기 업장만 수정 가능
    if (userId != checkRestaurant.ownerId) {
      throw new HttpError.Forbidden("본인 업장만 수정할 수 있습니다.");
    }

    const updatedRestaurant = await restaurantRepository.updateRestaurant(
      restaurantId,
      restaurantName,
      restaurantPhoneNumber,
      restaurantCity,
      restaurantAddress,
      restaurantStreetAddress,
      restaurantDetailAddress,
      mainFoodType,
      deliveryAvailableArea,
    ); // 레스토랑 정보 수정

    return updatedRestaurant;
  }

  // 업장 삭제 서비스 메소드
  async deleteRestaurant(userId, restaurantId) {
    const checkRestaurant =
      await restaurantRepository.getRestaurantById(restaurantId);

    if (!checkRestaurant) {
      throw new HttpError.NotFound("업장이 존재하지 않습니다.");
    }

    //자기 업장만 삭제 가능
    if (userId != checkRestaurant.ownerId) {
      throw new HttpError.Forbidden("본인 업장만 삭제할 수 있습니다.");
    }

    const deleted = await restaurantRepository.deleteRestaurant(restaurantId); // 레스토랑 삭제
    return deleted;
  }

  /** 업장 검색 **/
  //1. 메인메뉴 타입 찾기
  findMenuType = async (searchWord) => {
    if (!searchWord) {
      throw new HttpError.BadRequest("검색 키워드를 입력해주세요.");
    }

    for (let [type, keywords] of Object.entries(mainMenuTypes)) {
      if (keywords.includes(searchWord)) {
        return [type, searchWord];
      }
    }
    return [undefined, searchWord];
  };

  //메인메뉴 타입에 맞는 업장 찾기
  searchRestaurant = async (type, keyWord) => {
    const findRestaurants = await restaurantRepository.searchRestaurant(
      type,
      keyWord,
    );

    if (findRestaurants.length === 0) {
      throw new HttpError.NotFound("검색 결과 업장이 존재하지 않습니다.! 텅!");
    }

    return findRestaurants.map((restaurant) => ({
      name: restaurant.name,
      phoneNumber: restaurant.phoneNumber,
      cityAddress: restaurant.cityAddress,
      streetAddress: restaurant.streetAddress,
      detailAddress: restaurant.detailAddress,
      mainMenuType: restaurant.mainMenuType,
      deliveryAvailableArea: restaurant.deliveryAvailableArea,
    }));
  };
}
