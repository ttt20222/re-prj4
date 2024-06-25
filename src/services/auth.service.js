import { HttpError } from "../errors/http.error.js";
import { MESSAGES } from "../constants/message.constant.js";
import { AuthRepository } from "../repositories/auth.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { transporter } from "../constants/transporter.constant.js";
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  HASH_SALT_ROUNDS,
  MIN_PASSWORD_LENGTH,
} from "../constants/auth.constant.js";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  SERVER_IP,
  SERVER_PORT,
} from "../constants/env.constant.js";

export class AuthService {
  authRepository = new AuthRepository();

  /** 회원 가입 **/
  signUp = async (
    email,
    password,
    name,
    nickname,
    phoneNumber,
    cityAddress,
    streetAddress,
    detailAddress,
  ) => {
    // 1. 이메일 중복여부 확인
    const existedUser = await this.authRepository.findUserByEmail(email);
    // 1-1. 이메일이 중복된 경우
    if (existedUser) {
      throw new HttpError.Conflict(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED);
    }
    // 2. 비밀번호 길이 검증
    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new HttpError.BadRequest(MESSAGES.AUTH.COMMON.PASSWORD.MIN_LENGTH);
    }
    // 3. 비밀번호를 해시화
    const hashedPassword = bcrypt.hashSync(password, HASH_SALT_ROUNDS);

    // 4-INPUT: 회원가입에 필요한 정보들을 repository로 전달
    const data = await this.authRepository.signUp(
      email,
      hashedPassword,
      name,
      nickname,
      phoneNumber,
      cityAddress,
      streetAddress,
      detailAddress,
    );
    // 4-OUTPUT: 회원가입 데이터 전달 받음

    // 5. 이메일 인증 기능 시작
    // 5-1. 이메일 인증 URL 생성
    const url = `http://${SERVER_IP}:${SERVER_PORT}/api/auth/verify-email?email=${email}`;

    // 5-2. 인증 이메일을 전송
    transporter.sendMail({
      from: "baemin0404@naver.com",
      to: email,
      subject: "[baemin] 회원가입 인증 메일입니다.",
      html: `<form action="${url}" method="POST">
        <h2 style="margin: 20px 0">[baemin] 이메일 인증 버튼을 클릭해 주세요.</h2>
        <p> 인증 유효시간은 3분 입니다. 3분 안에 버튼을 클릭해 주세요! <p>
        <button style=" background-color: #C0C0C0; color:#000000; width: 80px; height:40px; border-radius: 20px; border: none;">이메일 인증</button>
       </form>`,
    });

    // 6. 회원가입 정보를 controller에 전달
    return data;
  };

  /** 이메일 인증 **/
  verifyEmail = async (email) => {
    // 1-INPUT: email을 repository에 전달
    const verified = await this.authRepository.verifyEmail(email);
    // 1-OUTPUT: email 인증 결과

    // 2. email 인증 결과를 controller에 전달
    return verified;
  };

  /** 토큰 생성 함수(+재발급) **/
  generateAuthTokens = async (payload) => {
    // 1. payload에서 userId 획득
    const userId = payload.id;

    // 2. payload로 accessToken, hashedRefreshToken 획득
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
    const hashedRefreshToken = bcrypt.hashSync(refreshToken, HASH_SALT_ROUNDS);

    // 3-INPUT: 생성된 토큰 저장을 위해 repository로 필요한 정보 전달
    await this.authRepository.upsertToken(userId, hashedRefreshToken);

    // 4. 토큰생성 결과를 반환
    return { accessToken, refreshToken };
  };

  /** 로그인(+refreshToken) **/
  signIn = async (email, password) => {
    // 1. email로 해당 유저정보 가져오기
    const user = await this.authRepository.findUserByEmail(email);

    // 2. 비밀번호가 맞는지 확인
    const isPasswordMatched =
      user && bcrypt.compareSync(password, user.password);
    // 2-1. 만약 비밀번호가 일치하지 않으면
    if (!isPasswordMatched) {
      throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.UNAUTHORIZED);
    }

    // 3. 이메일 인증 여부 확인
    if (user.isEmailValid === false) {
      throw new HttpError.Forbidden(MESSAGES.AUTH.COMMON.EMAIL.ISEMAILVALID);
    }

    // 4. 페이로드
    const payload = { id: user.userId };
    const data = await this.generateAuthTokens(payload);

    // 4. 결과물을 controller에 전달
    return data;
  };
}
