//packages
import express from "express";
import { prisma } from "../utils/prisma/index.js";

//middlewares


const router=express();

console.log("<===Applyed userRouter===>");

//회원가입
try {
router.post('/set-in',async(req,res,next)=>{
    const {email,password,role,name,age,gender,profilimage}=req.body;

    if (!email||!password||!name||!age||!gender) {
        console.log(gender);
        return res.status(403).json({ErrorMessage:"필요한 정보를 전부 입력해주세요!"});
    }
    //등록된 같은 이메일 주소가 있는지 조회
    const isNaNEmail=await prisma.users.findFirst({
        where:{
            email:email
        }
    })
    if (isNaNEmail) return res.status(403).json({ErrorMessage:"이미 존재하는 계정입니다."});

    
    //유저 기록
    const user=await prisma.users.create({
        data: {
            email,password,role
        }
    });

    //유저 정보 기록
    const userinfo=await prisma.userinfos.create({
        data: {
            UserId:+user.userId,name,age,gender,profilimage
        }
    });


    return res.status(200).json({Message:"성공적으로 회원가입되었습니다!"});
});

//로그인
router.get("/log-in",(req,res)=>{
    return res.status(200).json({Message:"성공적으로 로그인되었습니다!"});
});


//본인계정 정보 확인
router.get('/myinfo',(req,res)=>{
    return res.status(200).json({Message:"코드 검증 완료"});
});

//본인 계정 정보 수정
router.patch('/myinfo-edit',(req,res)=>{
    return res.status(200).json({Message:"코드 검증 완료"});
});

//

    }catch(err) {
        next(err);
    }


export default router;