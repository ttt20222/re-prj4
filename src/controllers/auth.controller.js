import { MESSAGES } from "../constants/message.constant.js";
import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { AuthService } from "../services/auth.service.js";
import { HttpError } from "../errors/http.error.js";
import { prisma } from "../utils/prisma/index.js";

export class AuthController {
  authService = new AuthService();

  /** 회원 가입 **/
  signUp = async (req, res, next) => {
    try {
      // 1. 필요한 정보 가져오기
      const {
        email,
        password,
        name,
        nickname,
        phoneNumber,
        cityAddress,
        streetAddress,
        detailAddress,
      } = req.body;

      // 2-INPUT: 회원가입에 필요한 정보들 service로 전달.
      const newSignUp = await this.authService.signUp(
        email,
        password,
        name,
        nickname,
        phoneNumber,
        cityAddress,
        streetAddress,
        detailAddress,
      );
      // 2-OUPUT: 회원가입정보 + 카트생성정보

      // 3. 회원가입 인증메일 요구
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.AUTH.SIGN_UP.VERIFYEMAIL,
        data: newSignUp,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  /** 이메일 인증 **/
  verifyEmail = async (req, res, next) => {
    try {
      // 1. req.query에서 email 가져오기
      const { email } = req.query;

      // 2-INPUT: email 인증에 필요한 데이터 전달
      const verified = await this.authService.verifyEmail(email);
      // 2-OUTPUT: email 인증 결과

      // 3. 결과를 클라이언트에 전달
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.COMMON.EMAIL.VERIFIED,
        data: verified.isEmailValid,
      });
    } catch (err) {
      next(err);
    }
  };

  /** 로그인 (+refreshToken) **/
  signIn = async (req, res, next) => {
    try {
      // 1. 필요한 정보 가져오기
      const { email, password } = req.body;
      // 2-INPUT: 로그인에 필요한 정보를 service에 전달
      const singInData = await this.authService.signIn(email, password);
      // 2-OUTPUT: 로그인 하면서 토큰을 전달 받음

      // 3. 로그인 결과를 클라이언트에 반환
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
        data: singInData,
      });
    } catch (err) {
      next(err);
    }
  };

  /** 토큰 재발급 **/
  reToken = async (req, res, next) => {
    try {
      // 1. 필요한 정보 가져오기
      const user = req.user;
      const payload = { id: user.userId };

      // 2. 토큰 재발급에 필요한 정보를 service에 넘겨주기
      const reTokenData = await this.authService.generateAuthTokens(payload);

      // 3. 토큰 재발급 결과를 클라이언트에 반환
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        // message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
        message: "토큰 재발급에 성공했습니다.",
        data: reTokenData,
      });
    } catch (err) {
      next(err);
    }
  };

  //로그아웃 /auth/sign-out
  signOut = async (req, res, next) => {
    try {
      const { userId } = req.user;

      await prisma.Token.delete({
        where: { userId: +userId },
      });

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: "로그아웃에 성공했습니다.",
        data: {
          id: userId,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
