import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { prisma } from "../utils/prisma";

const router=express.Router();

//모든 이력서 조회_관리자
router.get("/manager/resumes",authMiddleware,(req,res,next)=>{
    const resumes=prisma.resumes.findMany();

    if (!resumes) return res.status(200).json({Message:"현재 게시된 이력서가 없습니다!"});

    
    return res.status(200).json(resumes);
});

//특정 이력서 수정 관리자
router.patch("/manager/:resumeid",authMiddleware,(req,res,next)=>{

});


export default router;