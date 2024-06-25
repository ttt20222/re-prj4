import { prisma } from "../utils/prisma/index.js";

export class AuthRepository {
  /** email로 user 찾기 **/
  findUserByEmail = async (email) => {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  };

  /** userId로 RefreshToken 찾기 **/
  findRefreshTokenByUserId = async (userId) => {
    const existingRefreshToken = await prisma.Token.findUnique({
      where: {
        userId: +userId,
      },
    });
    return existingRefreshToken;
  };

  /** userId로 user 찾기 **/
  findUserByUserId = async (userId) => {
    const user = await prisma.user.findUnique({
      where: {
        userId: +userId,
      },
    });
    return user;
  };

  /** refreshToken Upsert 하기 **/
  upsertToken = async (userId, hashedRefreshToken) => {
    const reToken = await prisma.token.upsert({
      where: {
        userId: +userId,
      },
      update: {
        refreshToken: hashedRefreshToken,
      },
      create: {
        userId: +userId,
        refreshToken: hashedRefreshToken,
      },
    });
    return reToken;
  };

  /** 회원 가입 + 카트 생성 **/
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
    const newSignUp = await prisma.user.create({
      data: {
        email,
        password,
        name,
        nickname,
        phoneNumber,
        cityAddress,
        streetAddress,
        detailAddress,
      },
    });
    newSignUp.password = undefined;
    const newCart = await prisma.cart.create({
      data: {
        userId: newSignUp.userId,
      },
    });
    return { newSignUp, newCart };
  };

  /** 이메일 인증 **/
  verifyEmail = async (email) => {
    const verified = await prisma.user.update({
      where: { email },
      data: { isEmailValid: true },
    });
    return verified;
  };
}
