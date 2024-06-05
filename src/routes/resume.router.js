import express from "express";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/auth.middleware.js";
import { prisma } from "../utils/prisma/index.js";

console.log("<===   Applyed resumeRouter    ===>");

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
router.patch("/resume/:resumeId",authMiddleware,async(req,res,next)=>{
    //사용자의 입력정보 수집
    const {content}=req.body;
    if (!content) return res.status(403).json({ErrorMessage:"필요한 정보를 입력해주세요"});

    const resumeId=req.params.resumeId;
    const user=req.user;

    //정보 검증 section===============

    //접근 권한 확인
    const resumeaccess=await prisma.resumes.findFirst({
        where:{
        
            UserId:+user.userId,
            resumeId:+resumeId
        }
    });

    if (!resumeaccess) return res.status(403).json({ErrorMessage:"접근할 권한이 없거나 존재하지 않습니다!"});


    //정보 기록 section===============
    const resume=await prisma.resumes.update({
        data: {
            content
        },
        where:{
            resumeId:+resumeId
        }
    });


    return res.status(200).json({Message:"성공적으로 수정되었습니다!"});
});

//4.이력서 삭제
router.delete("/resume/:resumeId",authMiddleware,async(req,res,next)=>{
    const resumeId=req.params.resumeId;
    const user=req.user;

    //정보 검증 section===============

    //접근 권한 확인
    const resumeaccess=await prisma.resumes.findFirst({
        where:{
        
            UserId:+user.userId,
            resumeId:+resumeId
        }
    });

    if (!resumeaccess) return res.status(403).json({ErrorMessage:"접근할 권한이 없거나 존재하지 않습니다!"});
    console.log(resumeaccess);

    const resumeDelete=await prisma.resumes.delete({
        where:{
            resumeId:+resumeId
        }
    })

    return res.status(200).json({Message:"성공적으로 삭제되었습니다!"});
});



export default router;