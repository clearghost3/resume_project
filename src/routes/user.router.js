import express from "express";


const router=express();

console.log("<===Applyed userRouter===>");

//회원가입
router.post('/set-in',(req,res)=>{
    return res.status(200).json({Message:"코드 검증 완료"});
});

//로그인
router.get("/log-in",(req,res)=>{
    return res.status(200).json({Message:"코드 검증 완료"});
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




export default router;