import nodemailer from "nodemailer";
import { MAILPASS } from "./env.constant.js";

// nodemailer를 사용해 SMTP 전송 객체를 생성
export const transporter = nodemailer.createTransport({
  service: "naver",
  host: "smtp.naver.com",
  // SMTP 서버 포트 번호
  port: 587,
  auth: {
    user: "baemin0404@naver.com",
    // 이메일 비밀번호
    pass: MAILPASS,
  },
});
