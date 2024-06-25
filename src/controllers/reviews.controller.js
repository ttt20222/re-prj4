import { MESSAGES } from "../constants/message.constant.js";
import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { ReviewsService } from "../services/reviews.service.js";

export class ReviewsController {
  reviewsService = new ReviewsService();

  /** 리뷰 생성 C **/
  createReview = async (req, res, next) => {
    try {
      // 1. 필요한 정보 받아오기
      // 1-1. 로그인 정보로부터 user 정보 가져오기
      const { userId } = req.user;
      // 1-2. req.params로부터 restaurantId 가져오기
      const { restaurantId } = req.params;
      // 1-3. req.body에 입력된 데이터들 가져오기
      const { orderId, score, review } = req.body;
      // 1-4. req.files에 등록된 파일목록 가져오기
      const files = req.files;

      // 2-INPUT: reviewsService에 매개변수로 위 정보 투입
      const createdReview = await this.reviewsService.createReview(
        userId,
        restaurantId,
        orderId,
        score,
        review,
        files,
      );
      // 2-OUTPUT: reviewsService로부터 넘어온 createdReview 정보 받음

      // 3. 받아온 createdReview 정보를 클라이언트에 반환
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.REVIEWS.CREATE.SUCCEED,
        data: createdReview,
      });
    } catch (err) {
      next(err);
    }
  };

  /** 리뷰 조회 R **/
  getReviews = async (req, res, next) => {
    try {
      // 1. 필요한 정보 받아오기
      // 1-1. req.params로부터 restaurantId 가져오기
      const { restaurantId } = req.params;
      // 1-2. 쿼리스트링으로 sort(정렬) 정보 가져오기
      const { sort } = req.query;

      // 2-INPUT: reviewsService에 매개변수로 위 정보를 투입
      const reviews = await this.reviewsService.getReviews(restaurantId, sort);
      // 2-OUTPUT: reviewsService로부터 넘어온 reviews 정보 받음

      // 3. 받아온 reviews 정보를 클라이언트에 반환
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.REVIEWS.READ_LIST.SUCCEED,
        data: reviews,
      });
    } catch (err) {
      next(err);
    }
  };

  /** 리뷰 수정 U **/
  updateReview = async (req, res, next) => {
    try {
      // 1. 필요한 정보 받아오기
      // 1-1. 로그인 정보로부터 user 정보 가져오기
      const { userId } = req.user;
      // 1-2. req.params로부터 restaurantId, reviewId 가져오기
      const { restaurantId, reviewId } = req.params;
      // 1-3. req.body로부터 수정할 내용 가져오기
      const { score, review } = req.body;
      // 1-4. req.files에 등록된 파일목록 가져오기
      const files = req.files;

      // 2-INPUT: reviewsService에 매개변수로 위 정보를 투입
      const updatedReview = await this.reviewsService.updateReview(
        userId,
        restaurantId,
        reviewId,
        score,
        review,
        files,
      );
      // 2-OUTPUT: reviewsService로부터 넘어온 updatedReview 정보 받음

      // 3. 받아온 updatedReview 정보를 클라이언트에 반환
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.REVIEWS.UPDATE.SUCCEED,
        data: updatedReview,
      });
    } catch (err) {
      next(err);
    }
  };

  /** 리뷰 삭제 D **/
  deleteReview = async (req, res, next) => {
    try {
      // 1. 필요한 정보 가져오기
      // 1-1. 로그인 정보로부터 user 정보 가져오기
      const { userId } = req.user;
      // 1-2. req.params로부터 restaurantId, reviewId 가져오기
      const { restaurantId, reviewId } = req.params;

      // 2-INPUT: reviewsService에 매개변수로 위 정보를 투입
      const deletedReview = await this.reviewsService.deleteReview(
        userId,
        restaurantId,
        reviewId,
      );
      // 2-OUTPUT: reviewsService로부터 넘어온 deletedReview 정보 받음

      // 3. 받아온 deletedReview 정보를 클라이언트에 반환
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.REVIEWS.DELETE.SUCCEED,
        data: deletedReview.reviewId,
      });
    } catch (err) {
      next(err);
    }
  };
}
