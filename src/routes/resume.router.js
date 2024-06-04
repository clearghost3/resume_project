import express from "express";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/auth.middleware.js";
import { prisma } from "../utils/prisma/index.js";

console.log("<===Applyed resumeRouter===>");

const router=express.Router();

//1.본인 이력서 지원


router.post("/resume/apply",authMiddleware,async(req,res,next)=>{
    
    //사용자의 입력정보를 수집
    const {content}=req.body;
    if (!content) return res.status(401).json({ErrorMessage:"이력서 내용을 작성해주세요!"});


    const user=req.user;

    //Resume테이블 행의 정보를 수집하기 위해서 Userinfos테이블을 조회
    const userinfo=await prisma.userinfos.findFirst({
        where:{
            UserId:+user.userId
        }
    });

    //가져온 정보들로 Resume의 행을 작성
    const resume=await prisma.resumes.create({
        data:{
            UserId:+user.userId,
            name:userinfo.name,
            age:+userinfo.age,
            content:content,
            decision_reason:"manager확인 대기중"
        }
    })
    return res.status(200).json({Message:"성공적으로 지원완료 되었습니다!"});
});


// 2.본인 이력서(들) 확인
router.get("/resume/my_resumes",authMiddleware,async(req,res,next)=>{
    const user=req.user;
    const resumes=await prisma.resumes.findMany({
        where: {
            UserId:user.userId
        }
    });
    return res.status(200).json({Message:resumes});
});

//3.본인 이력서 수정
router.patch("/resume/:my_resumeid",authMiddleware,async(req,res,next)=>{
    const user=req.user;

    return res.status(200).json({Message:"코드 검증 완료"});
});

//4.이력서 삭제
router.delete("/resume/:my_resumeid",authMiddleware,async(req,res,next)=>{
    const user=req.user;

    return res.status(200).json({Message:"코드 검증 완료"});
});



export default router;