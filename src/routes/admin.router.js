import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { prisma } from "../utils/prisma/index.js";

const router=express.Router();

console.log("<===   Applyed adminRouter    ===>");

// 1.모든 이력서 조회_관리자
router.get("/manager/resumes",authMiddleware,async(req,res,next)=>{
    //관리자 권한을 가지고 있음을 확인
    if (!req.manager) return res.status(401).json({ErrorMessage:"권한이 없습니다!"});


    const resumes=await prisma.resumes.findMany();

    if (!resumes) return res.status(200).json({Message:"현재 게시된 이력서가 없습니다!"});

    
    return res.status(200).json(resumes);
});

//2.특정 이력서 수정 관리자
router.patch("/manager/resumes/:resumeId",authMiddleware,async(req,res,next)=>{
    //관리자 권한을 가지고 있음을 확인
    const resumeId=req.params.resumeId;
    const user=req.user;
    if (!req.manager) return res.status(401).json({ErrorMessage:"권한이 없습니다!"});

    const userinfo=await prisma.userinfos.findFirst({
        where:{
            UserId:+user.userId
        }
    });


    //사용자 입력을 받음
    const {status,decision_reason}=req.body;
    if (!status||!decision_reason) return res.status(400).json({ErrorMessage:"필요한 정보를 전부 입력해주세요!"});
    
    const modify_resume=await prisma.resumes.update({
        data: {
            status,
            decision_reason,
            manager:userinfo.name
        },
        where: {
            resumeId:+resumeId
        }
    })
    return res.status(200).json({Message:"성공적으로 이력서가 수정되었습니다!"});
});


export default router;