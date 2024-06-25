import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import "../constants/env.constant.js";
import { MESSAGES } from "../constants/message.constant.js";
import { HttpError } from "../errors/http.error.js";

// s3 사용을 위한 세팅
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
});

// 업로드 할 파일의 확장자명 제한목록
const allowedExtensions = [".png", ".jpg", ".jpeg", ".bmp", ".gif", ".tiff"];

// 로컬에 저장 (테스트용)
const toLocal = multer({
  storage: multer.diskStorage({
    // 파일 저장 위치
    destination: function (req, file, done) {
      // null은 문제가 생겼을 때, 그게 아니라면 "tests/"에 저장
      done(null, "test/");
    },
    filename: function (req, file, done) {
      // 임의번호 생성 (8자리)
      let randomNumber = "";
      for (let i = 0; i < 8; i++) {
        randomNumber += String(Math.floor(Math.random() * 9.9));
      }
      const ext = path.extname(file.originalname);
      done(null, Date.now() + "_" + randomNumber + ext);
    },
  }),
  // 파일 허용 사이즈 제한 (10 MB)
  limits: { fileSize: 10 * 1024 * 1024 },
});

// s3에 저장 (실전용(?))
const toS3 = multer({
  storage: multerS3({
    // 멀터에서 제공하는 기본 공식 그대로 입력...
    s3: s3,
    bucket: process.env.AWS_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, callback) => {
      // 오늘 날짜 구하기
      const today = new Date();
      const todayNum = Number(today);

      // 임의번호 생성 (8자리)
      let randomNumber = "";
      for (let i = 0; i < 8; i++) {
        randomNumber += String(Math.floor(Math.random() * 9.9));
      }

      // 확장자 검사
      const extension = path.extname(file.originalname).toLowerCase();
      try {
        if (!allowedExtensions.includes(extension)) {
          return callback(
            new HttpError.BadRequest(MESSAGES.UPLOADS.COMMON.NOT_SUPPORT),
          );
        }
      } catch (err) {
        next(err);
      }

      // test라는 파일 내부에 임의의 todayNum과 임의번호를 합쳐 파일명 생성
      callback(null, `test/${todayNum}_${randomNumber}` + extension);
    },
    // acl 권한 설정
    acl: "public-read-write",
  }),
  // 이미지 용량 제한 (10MB)
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export { toLocal, toS3 };
