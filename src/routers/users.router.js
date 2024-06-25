import express from "express";
import { requireAccessToken } from "../middlewares/require-access-token.middleware.js";
import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { MESSAGES } from "../constants/message.constant.js";

const usersRouter = express.Router();

// "/users" 엔드포인트에 대한 GET 요청을 처리합니다.
// 이 요청은 requireAccessToken 미들웨어를 통해 인증됩니다.
usersRouter.get("/", requireAccessToken, (req, res, next) => {
  try {
    const data = req.user;
    data.password = undefined;

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.USERS.READ_ME.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});

export { usersRouter };
