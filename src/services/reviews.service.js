import { HttpError } from "../errors/http.error.js";
import { MESSAGES } from "../constants/message.constant.js";
import { ReviewsRepository } from "../repositories/reviews.repository.js";

export class ReviewsService {
  reviewsRepository = new ReviewsRepository();
  /** 리뷰 생성 C **/
  createReview = async (
    userId,
    restaurantId,
    orderId,
    score,
    review,
    files,
  ) => {
    // 1. 해당 식당이 존재하는지?
    // 1-1. 해당 식당 존재여부 reviewsRepository에 물어보기
    // 이 부분은 팀원들과 파일 합치면 팀원이 만든 다른 Repository 함수로 변경
    const isExistingRestaurant =
      await this.reviewsRepository.findRestaurantById(restaurantId);
    // 1-2. 식당이 존재하지 않으면?
    if (!isExistingRestaurant) {
      // message constant 작성하면 "" 제거하기
      throw new HttpError.NotFound(MESSAGES.RESTAURANTS.COMMON.NOT_FOUND);
    }

    // 2. 해당 orderId로 작성된 리뷰가 이미 존재하는지?
    // 2-1. 해당 리뷰 존재여부 reviewsRepository에 물어보기
    const isExistingReview =
      await this.reviewsRepository.findReviewByOrderId(orderId);
    // 2-2. 리뷰가 존재하면?
    if (isExistingReview) {
      // message constant 작성하면 "" 제거하기
      throw new HttpError.Conflict(MESSAGES.REVIEWS.CREATE.ALREADY_REVIEWED);
    }

    // 3-INPUT: reviewsRepository에 매개변수 투입
    const createdReview = await this.reviewsRepository.createReview(
      userId,
      restaurantId,
      orderId,
      score,
      review,
      files,
    );
    // 3-OUTPUT: reviewsRepository로부터 생성된 createdReview 정보 받음

    // 4. 생성된 createdReview 정보를 Controller에 전달
    return createdReview;
  };

  /** 리뷰 조회 R **/
  getReviews = async (restaurantId, sort) => {
    // 1-INPUT: reviewsRepository에 매개변수 투입
    let newSort;
    if (!sort) {
      newSort = "desc";
    } else {
      newSort = sort;
    }
    let datas = await this.reviewsRepository.getReviews(restaurantId, newSort);
    // 1-OUTPUT: datas에 reviewsRepository로부터 조회된 reviews 정보 받음

    // 2. reviewsRepository로부터 조회된 reviews 정보가 담긴 datas를 가공
    datas = datas.map((rv) => {
      return {
        reviewId: rv.reviewId,
        nickname: rv.User.nickname,
        orderId: rv.orderId,
        score: rv.score,
        review: rv.review,
        reviewImages: rv.Image,
        createdAt: rv.createdAt,
        updatedAt: rv.updatedAt,
      };
    });

    // 3. 가공된 datas를 reviews에 담기
    const reviews = datas;

    // 4. 완성된 reviews 정보를 Controller에 전달
    return reviews;
  };

  /** 리뷰 수정 U **/
  updateReview = async (
    userId,
    restaurantId,
    reviewId,
    score,
    review,
    files,
  ) => {
    // 1. 해당 식당이 존재하는지?
    // 1-1. 해당 식당 존재여부 reviewsRepository에 물어보기
    // 이 부분은 팀원들과 파일 합치면 팀원이 만든 다른 Repository 함수로 변경
    const isExistingRestaurant =
      await this.reviewsRepository.findRestaurantById(restaurantId);
    // 1-2. 식당이 존재하지 않으면?
    if (!isExistingRestaurant) {
      // message constant 작성하면 "" 제거하기
      throw new HttpError.NotFound(MESSAGES.RESTAURANTS.COMMON.NOT_FOUND);
    }

    // 2. 삭제하려는 리뷰가 존재하는지?
    // 2-1. 해당 리뷰 존재여부 reviewsRepository에 물어보기
    const isExistingReview =
      await this.reviewsRepository.findReviewByReviewId(reviewId);
    // 2-2. 리뷰가 존재하지 않으면?
    if (!isExistingReview) {
      // message constant 작성하면 "" 제거하기
      throw new HttpError.NotFound(MESSAGES.REVIEWS.COMMON.NOT_FOUND);
    }

    // 3-INPUT: reviewsRepository에 매개변수 투입
    const updatedReview = await this.reviewsRepository.updateReview(
      userId,
      reviewId,
      score,
      review,
      files,
    );
    // 3-OUTPUT: reviewsRepository로부터 수정된 updatedReview 정보 받음

    // 4. 수정된 updatedReview 정보를 Controller에 전달
    return updatedReview;
  };

  /** 리뷰 삭제 D **/
  deleteReview = async (userId, restaurantId, reviewId) => {
    // 1. 해당 식당이 존재하는지?
    // 1-1. 해당 식당 존재여부 reviewsRepository에 물어보기
    // 이 부분은 팀원들과 파일 합치면 팀원이 만든 다른 Repository 함수로 변경
    const isExistingRestaurant =
      await this.reviewsRepository.findRestaurantById(restaurantId);
    // 1-2. 식당이 존재하지 않으면?
    if (!isExistingRestaurant) {
      // message constant 작성하면 "" 제거하기
      throw new HttpError.NotFound(MESSAGES.RESTAURANTS.COMMON.NOT_FOUND);
    }

    // 2. 삭제하려는 리뷰가 존재하는지?
    // 2-1. 해당 리뷰 존재여부 reviewsRepository에 물어보기
    const isExistingReview =
      await this.reviewsRepository.findReviewByReviewId(reviewId);
    // 2-2. 리뷰가 존재하지 않으면?
    if (!isExistingReview) {
      // message constant 작성하면 "" 제거하기
      throw new HttpError.NotFound(MESSAGES.REVIEWS.COMMON.NOT_FOUND);
    }

    // 3-INPUT: reviewsRepository에 매개변수 투입
    const deletedReview = await this.reviewsRepository.deleteReview(
      userId,
      reviewId,
    );
    // 3-OUTPUT: reviewsRepository로부터 삭제된 deletedReview 정보 받음

    // 4. 삭제된 deletedReview 정보를 Controller에 전달
    return deletedReview;
  };
}
