import { prisma } from "../utils/prisma/index.js";

export class AdminRepository {
  readAll = async () => {
    let users = await prisma.user.findMany({
      orderBy: { userId: "desc" },
    });

    users = users.map((user) => {
      return {
        userId: user.userId,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        phoneNumber: user.phoneNumber,
        role: user.role,
        cityAddress: user.cityAddress,
        streetAddress: user.streetAddress,
        detailAddress: user.detailAddress,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });
    return users;
  };

  readById = async (userId, name) => {
    let user = await prisma.user.findUnique({
      where: { userId: +userId, name },
    });

    if (!user) {
      return null; // 존재하지 않는 경우 null을 반환하도록
    }

    user = {
      userId: user.userId,
    };

    return user;
  };

  findByRole = async (userId, role) => {
    const existedRole = await prisma.user.findFirst({
      where: { userId: +userId, role },
      select: {
        userId: true,
        name: true,
        role: true,
      },
    });
    return existedRole;
  };

  update = async (userId, name, role) => {
    const updatedRole = await prisma.user.update({
      where: { userId: +userId, name },
      data: {
        userId,
        name,
        role,
      },
    });
    return {
      userId: updatedRole.userId,
      name: updatedRole.name,
      role: updatedRole.role,
      createdAt: updatedRole.createdAt,
      updatedAt: updatedRole.updatedAt,
    };
  };
}
