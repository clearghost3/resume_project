//packages
import express from "express";
import { prisma } from "../utils/prisma/index.js";
import jwt from "jsonwebtoken";
import bcrypt,{compareSync} from "bcrypt";

//middlewares
import authMiddleware from "../middlewares/auth.middleware.js";

const ACCESS_KEY="First_Key";

const router=express();

console.log("<===Applyed userRouter===>");

//회원가입
router.post('/set-in',async(req,res,next)=>{

    //정보를 입력받음
    const {email,password,role,name,age,gender,profilimage}=req.body;
    //필요한 정보가 전부 입력되었는지 확인
    if (!email||!password||!name||!age||!gender) return res.status(403).json({ErrorMessage:"필요한 정보를 전부 입력해주세요!"});

    //정보 검증 section===============

    


    //등록된 같은 이메일 주소가 있는지 조회
    const isNaNEmail=await prisma.users.findFirst({
        where:{
            email:email
        }
    })
    if (isNaNEmail) return res.status(403).json({ErrorMessage:"이미 존재하는 계정입니다."});


    //정보 기록 section===============
    //비밀번호 암화
    const salt=10;
    const hashed_password=await bcrypt.hash(password,10);


    //유저 기록
    const user=await prisma.users.create({
        data: {
            email,password:hashed_password,role
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
router.get("/log-in",async(req,res,next)=>{

    //로그인 정보를 입력받음
    const {email,password}=req.body;
    //필요한 정보가 전부 입력되었는지 확인
    if (!email||!password) return res.status(403).json({ErrorMessage:"필요한 정보를 전부 입력해주세요!"});

    //정보 검증 section===============

    //입력한 이메일 주소가 실제로 있는지 확인
    const user=await prisma.users.findFirst({
        where: {
            email:email
        }
    });
    if (!user) return res.json({ErrorMessage:"존재하지 않는 계정입니다."});

    //찾아낸 계정의 비밀번호 비교로 확인
    if (!(await bcrypt.compare(password,user.password))) return res.status(403).json({ErrorMessage:"비밀번호가 틀립니다!"});
    


    //로그인이 성공하였으면, 토큰을 생성
    const Access_token=jwt.sign(user.userId,ACCESS_KEY);
    res.cookie("Authorization",`Bearer ${Access_token}`,{maxAge:1000*60*60});

    return res.status(200).json({Message:"성공적으로 로그인되었습니다!"});
});


//본인계정 정보 확인
router.get('/myinfo',authMiddleware,async(req,res,next)=>{

    const user=req.user;

    const userinfo=await prisma.userinfos.findFirst({
        where:{
            UserId:+user.userId
        },select:{
            name:true,
            age:true,
            gender:true,
            profilimage:true,
        }
    });


    const total_info=Object.assign(user,userinfo)

    return res.status(200).json({total_info});

    return res.status(200).json({Message:"코드 검증 완료"});
});

//본인 계정 정보 수정
router.patch('/myinfo-edit',(req,res,next)=>{
    return res.status(200).json({Message:"코드 검증 완료"});
});




export default router;