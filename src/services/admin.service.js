import { AdminRepository } from "../repositories/admin.repository.js";
import { HttpError } from "../errors/http.error.js";
import { MESSAGES } from "../constants/message.constant.js";

export class AdminService {
  adminRepository = new AdminRepository();

  readAll = async (adminRole) => {
    //관리자만 유저 목록을 볼 수 있음.
    if (adminRole != "ADMIN") {
      throw new HttpError.Forbidden("관리자가 아닙니다.");
    }
    const users = await this.adminRepository.readAll();

    return users;
  };

  update = async (userId, name, role, adminRole) => {
    //관리자만 유저 목록을 볼 수 있음.
    if (adminRole != "ADMIN") {
      throw new HttpError.Forbidden("관리자가 아닙니다.");
    }
    //존재하는 유저인지 확인
    const existedUser = await this.adminRepository.readById(userId, name);

    if (!existedUser) {
      throw new HttpError.NotFound(MESSAGES.ADMIN.COMMON.NOT_FOUND);
    }

    // 이미 존재하는 ROLE인지 체크
    const existedRole = await this.adminRepository.findByRole(userId, role);
    if (existedRole) {
      throw new HttpError.BadRequest(
        MESSAGES.ADMIN.COMMON.ROLE.ROLE_ALREADY_EXISTS,
      );
    }

    const updatedRole = await this.adminRepository.update(userId, name, role);
    return updatedRole;
  };
}
