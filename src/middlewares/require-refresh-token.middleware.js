import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { MESSAGES } from "../constants/message.constant.js";
import { REFRESH_TOKEN_SECRET } from "../constants/env.constant.js";
import { AuthRepository } from "../repositories/auth.repository.js";

const authRepository = new AuthRepository();

export const requireRefreshToken = async (req, res, next) => {
  try {
    // 1. req.headers.authorization
    const authorization = req.headers.authorization;

    // 1-1. Authorization이 없는 겨우
    if (!authorization) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.COMMON.JWT.NO_TOKEN,
      });
    }

    // 2. JWT 표준 인증 형태와 일치하지 않는 경우
    const [type, refreshToken] = authorization.split(" ");

    // 2-1. Bearer가 아닌 경우
    if (type !== "Bearer") {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.COMMON.JWT.NOT_SUPPORTED_TYPE,
      });
    }

    // 3. RefreshToken이 없는 경우
    if (!refreshToken) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.COMMON.JWT.NO_TOKEN,
      });
    }

    // 4. payload 검증
    let payload;
    try {
      payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (error) {
      // 4-1. AccessToken의 유효기간이 지난 경우
      if (error.name === "TokenExpiredError") {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: MESSAGES.AUTH.COMMON.JWT.EXPIRED,
        });
      }
      // 4-2. 그 밖의 검증에 실패한 경우
      else {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: MESSAGES.AUTH.COMMON.JWT.INVALID,
        });
      }
    }

    // 5. DB에서 RefreshToken 조회
    const userId = payload.id;
    const existingRefreshToken =
      await authRepository.findRefreshTokenByUserId(userId);
    // 5-1. 넘겨 받은 RefreshToken과 비교
    const isValidRefreshToken =
      existingRefreshToken?.refreshToken &&
      bcrypt.compareSync(refreshToken, existingRefreshToken.refreshToken);

    if (!isValidRefreshToken) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.COMMON.JWT.DISCARDED_TOKEN,
      });
    }

    // 6. Payload에 담긴 사용자 ID와 일치하는 사용자가 없는 경우
    const user = await authRepository.findUserByUserId(userId);
    // 6-1. 사용자가 없는 경우
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.COMMON.JWT.NO_USER,
      });
    }
    // 6-2. 사용자가 있는 경우 req.user에 해당 user 정보 담아주기
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
