import express from "express";
import authMiddleware from "../middlewares/auth.middleware";

const router=express.Router();

//모든 이력서 조회_관리자
router.get("/manager/resumes",authMiddleware,(req,res,next)=>{

});

//특정 이력서 수정 관리자
router.patch("/manager/:resumeid",authMiddleware,(req,res,next)=>{

});


export default router;