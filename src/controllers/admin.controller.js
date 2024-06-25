import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { AdminService } from "../services/admin.service.js";
import { MESSAGES } from "../constants/message.constant.js";

export class AdminController {
  adminService = new AdminService();

  readAll = async (req, res, next) => {
    try {
      const adminRole = req.user.role;
      const users = await this.adminService.readAll(adminRole);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.ADMIN.USER.READ_LIST.SUCCEED,
        users,
      });
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const adminRole = req.user.role;
      //req.body에서 데이터 추출
      const { userId, name, role } = req.body;

      const updatedRole = await this.adminService.update(
        userId,
        name,
        role,
        adminRole,
      );

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.ADMIN.USER.ROLE.UPDATE.SUCCEED,
        updatedRole,
      });
    } catch (err) {
      next(err);
    }
  };
}
