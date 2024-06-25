import express from "express";
import { toS3 } from "../middlewares/multer.middleware.js";
import { ReviewsController } from "../controllers/reviews.controller.js";
import { requireAccessToken } from "../middlewares/require-access-token.middleware.js";
import { createReviewValidator } from "../middlewares/validators/create-review-validator.middleware.js";
import { updateReviewValidator } from "../middlewares/validators/update-review-validator.middleware.js";

const reviewsRouter = express.Router();

// ReviewsController를 인스턴스화 시킨다.
const reviewsController = new ReviewsController();

/** 리뷰 생성 C **/
reviewsRouter.post(
  "/:restaurantId/reviews",
  requireAccessToken,
  toS3.array("files", 5),
  createReviewValidator,
  reviewsController.createReview,
);

/** 리뷰 조회 R **/
reviewsRouter.get("/:restaurantId/reviews", reviewsController.getReviews);

/** 리뷰 수정 U **/
reviewsRouter.patch(
  "/:restaurantId/reviews/:reviewId",
  requireAccessToken,
  toS3.array("files", 5),
  updateReviewValidator,
  reviewsController.updateReview,
);

/** 리뷰 삭제 D **/
reviewsRouter.delete(
  "/:restaurantId/reviews/:reviewId",
  requireAccessToken,
  reviewsController.deleteReview,
);

export { reviewsRouter };
