import { prisma } from "../utils/prisma/index.js";

export class ReviewsRepository {
  /** 리뷰 생성 C **/
  createReview = async (
    userId,
    restaurantId,
    orderId,
    score,
    review,
    files,
  ) => {
    // 1. 전달받은 매개변수를 활용하여 리뷰 생성
    // + [reviews] 테이블과 [images] 테이블에
    //   데이터를 동시에 생성해야하므로 트랜잭션
    let reviewDatas;
    let reviewImages = [];
    const createdReview = await prisma.$transaction(async (tx) => {
      // 1-1. 리뷰 생성
      const createdReview = await tx.review.create({
        data: {
          userId: +userId,
          restaurantId: +restaurantId,
          orderId: +orderId,
          score: +score,
          review,
        },
      });
      reviewDatas = createdReview;
      // 1-2. 이미지 저장경로 저장
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const location = files[i].location;
          const image = await tx.image.create({
            data: {
              reviewId: createdReview.reviewId,
              imageUrl: location,
            },
          });
          reviewImages.push(image);
        }
      }
    });
    // 2. 생성된 createdReview 정보를 reviewsService로 전달
    return { reviewDatas, reviewImages };
  };

  /** 리뷰 조회 R-List **/
  getReviews = async (restaurantId, sort) => {
    // 1. 전달받은 매개변수를 활용하여 리뷰 조회
    const reviews = await prisma.review.findMany({
      select: {
        reviewId: true,
        User: {
          select: {
            nickname: true, // 작성자의 userId 대신 nickname 표시
          },
        },
        orderId: true,
        score: true,
        review: true,
        Image: {
          select: {
            imageUrl: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      where: {
        restaurantId: +restaurantId,
      },
      orderBy: {
        createdAt: sort ? sort.toLowerCase() : "desc", // 정렬 혹시 몰라서 넣어뒀습니다.
      },
    });
    // 2. 조회된 reviews 정보를 reviewsService로 전달
    return reviews;
  };

  /** reviewId 리뷰 조회 R-d **/
  findReviewByReviewId = async (reviewId) => {
    // 1. 전달받은 매개변수를 활용하여 리뷰 조회
    const review = await prisma.review.findFirst({
      where: {
        reviewId: +reviewId,
      },
    });

    // 2. 조회된 review 정보를 reviewsService로 전달
    return review;
  };

  /** orderId 리뷰 조회 R-d **/
  findReviewByOrderId = async (orderId) => {
    // 1. 전달받은 매개변수를 활용하여 리뷰 조회
    const review = await prisma.review.findFirst({
      where: {
        orderId: +orderId,
      },
    });

    // 2. 조회된 review 정보를 reviewsService로 전달
    return review;
  };

  /** 리뷰 수정 U **/
  updateReview = async (userId, reviewId, score, review, files) => {
    // 1. 전달받은 매개변수를 활용하여 리뷰 수정
    // + [reviews] 테이블과 [images] 테이블에
    //   데이터를 동시에 생성해야하므로 트랜잭션
    let reviewDatas;
    let reviewImages = [];
    const updatedReview = await prisma.$transaction(async (tx) => {
      // 1-1. 리뷰 수정
      const updatedReview = await tx.review.update({
        data: {
          score: +score,
          review,
        },
        where: {
          userId: +userId,
          reviewId: +reviewId,
        },
      });
      reviewDatas = updatedReview;
      // 1-2. 이미지 저장경로 저장
      if (files) {
        await tx.image.deleteMany({
          where: {
            reviewId: +reviewId,
          },
        });
        for (let i = 0; i < files.length; i++) {
          const location = files[i].location;
          const image = await tx.image.create({
            data: {
              reviewId: updatedReview.reviewId,
              imageUrl: location,
            },
          });
          reviewImages.push(image);
        }
      }
    });
    // 2. 생성된 createdReview 정보를 reviewsService로 전달
    return { reviewDatas, reviewImages };
  };

  /** 리뷰 삭제 D **/
  deleteReview = async (userId, reviewId) => {
    console.log(userId, reviewId);
    // 1. 전달받은 매개변수를 바탕으로 리뷰 삭제
    const deletedReview = await prisma.review.delete({
      where: {
        userId: +userId,
        reviewId: +reviewId,
      },
    });
    // 2. 삭제된 deletedReview 정보를 reviewsService로 전달
    return deletedReview;
  };

  /** 임시로 만든 식당 찾기 임시!! 머지하고나면 다른 repository 활용 리팩토링 **/
  findRestaurantById = async (restaurantId) => {
    // 1. 전달받은 매개변수를 바탕으로 식당 검색
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        restaurantId: +restaurantId,
      },
    });

    // 2. 조회된 restaurant 정보를 reviewsService로 전달
    return restaurant;
  };
}
