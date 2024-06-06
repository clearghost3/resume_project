//packages
import express from "express";
import { prisma } from "../utils/prisma/index.js";
import jwt from "jsonwebtoken";
import bcrypt, { compareSync } from "bcrypt";

//middlewares
import authMiddleware from "../middlewares/auth.middleware.js";

const ACCESS_KEY = "First_Key";

const router = express();

console.log("<===   Applyed userRouter  ===>");

//회원가입
router.post("/set-in", async (req, res, next) => {
  //정보를 입력받음
  const { email, password, role, name, age, gender, profileimage } = req.body;
  //필요한 정보가 전부 입력되었는지 확인
  if (!email || !password || !name || !age || !gender)
    return res
      .status(403)
      .json({ ErrorMessage: "필요한 정보를 전부 입력해주세요!" });

  //정보 검증 section===============

  //등록된 같은 이메일 주소가 있는지 조회
  try {
    //트랜잭션으로 이루어짐
    const result=await prisma.$transaction(async(tx)=>{
        const isNaNEmail = await prisma.users.findFirst({
            where: {
              email: email,
            },
          });
          if (isNaNEmail)
            return res
              .status(403)
              .json({ ErrorMessage: "이미 존재하는 계정입니다." });
      
          //정보 기록 section===============
          //비밀번호 암화
          const salt = 10;
          const hashed_password = await bcrypt.hash(password, 10);
      
          //유저 기록
          const user = await prisma.users.create({
            data: {
              email,
              password: hashed_password,
              role,
            },
          });
          //유저 정보 기록
          const userinfo = await prisma.userinfos.create({
            data: {
              UserId: +user.userId,
              name,
              age,
              gender,
              profileimage,
            },
          });
      
          if (role === "manager")
            return res
              .status(200)
              .json({ Message: "관리자 계정으로 성공적으로 회원가입되었습니다!" });
          return res.status(200).json({ Message: "성공적으로 회원가입되었습니다!" });
    });
  } catch (err) {
    next(err);
  }
});

//로그인
router.get("/log-in", async (req, res, next) => {
  //로그인 정보를 입력받음
  const { email, password } = req.body;

  //필요한 정보가 전부 입력되었는지 확인
  if (!email || !password)
    return res
      .status(403)
      .json({ ErrorMessage: "필요한 정보를 전부 입력해주세요!" });

  //정보 검증 section===============

  //입력한 이메일 주소가 실제로 있는지 확인
  const user = await prisma.users.findFirst({
    where: {
      email: email,
    },
  });
  if (!user) return res.json({ ErrorMessage: "존재하지 않는 계정입니다." });

  //찾아낸 계정의 비밀번호 비교로 확인
  if (!(await bcrypt.compare(password, user.password)))
    return res.status(403).json({ ErrorMessage: "비밀번호가 틀립니다!" });

  //로그인이 성공하였으면, 토큰을 생성
  const Access_token = jwt.sign(user.userId, ACCESS_KEY);
  res.cookie("Authorization", `Bearer ${Access_token}`, {
    maxAge: 1000 * 60 * 60,
  });

  if (user.role === "Manager")
    return res
      .status(200)
      .json({ Message: "관리자 계정으로 성공적으로 로그인되었습니다!" });
  return res.status(200).json({ Message: "성공적으로 로그인되었습니다!" });
});

//본인계정 정보 확인
router.get("/myinfo", authMiddleware, async (req, res, next) => {
  try {
    const user = req.user;

    //트랜잭션으로 설정됨
    const result = await prisma.$transaction(async (tx) => {
      const userinfo = await tx.userinfos.findFirst({
        where: {
          UserId: +user.userId,
        },
        select: {
          name: true,
          age: true,
          gender: true,
          profileimage: true,
        },
      });

      //객체를 합쳐 통합된 정보데이터 생성
      const total_info = Object.assign(user, userinfo);
      return res.status(200).json({ total_info });
    });
  } catch (err) {
    next(err);
  }
});

//본인 계정 정보 수정
router.patch("/myinfo-edit", authMiddleware, async (req, res, next) => {
  try {
    //유저 입력 받아오기
    let { name, age, gender, profileimage } = req.body;

    //쿠키에서 유저 정보 가져오기
    const user = req.user;

    const result = await prisma.$transaction(async (tx) => {
      //원래 정보가져오기
      const userinfo = await tx.userinfos.findFirst({
        where: {
          UserId: +user.userId,
        },
        select: {
          name: true,
          age: true,
          gender: true,
          profileimage: true,
        },
      });

      //입력되지 않은 정보는 기본값을 유지하도록 설정
      if (!name) name = userinfo.name;
      if (!age) age = userinfo.age;
      if (!gender) gender = userinfo.gender;
      if (!profileimage) profileimage = userinfo.profileimage;

      const edituserinfo = await tx.userinfos.update({
        data: {
          name,
          age: +age,
          gender,
          profileimage,
        },
        where: {
          UserId: +user.userId,
        },
      });
      return res.status(200).json({ Message: "성공적으로 수정 되었습니다!" });
    });
  } catch (err) {
    next(err);
  }
});

//로그아웃
router.get("/log-out", (req, res) => {
  res.clearCookie("Authorization");
  return res.json({ Message: "성공적으로 로그아웃 하셨습니다!" });
});

export default router;
