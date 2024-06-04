import jwt from "jsonwebtoken";
import {prisma} from '../utils/prisma/index.js'
import { json } from "express";

const REFRESH_KEYS=["Second_Key","Third_Key","Fourth_Key"];

export default async function(req,res,next) {
    try {
        const {Authorization}=req.cookies;
        const [tokentype,token]=Authorization.split(" ");
        
        //token타입을 검증
        if (tokentype!=="Bearer") return res.status(403).json({ErrorMessage:"토큰 타입이 일치하지 않습니다"});

        const decodedToken=jwt.verify(token,First_Key);

        
    }
    catch(err) {
        console.Error(err);
        return res.status(403).json("token 관련 문제입니다!");
    }
    next();
}