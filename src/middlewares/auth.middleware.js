import jwt from "jsonwebtoken";
import { prisma } from '../utils/prisma/index.js'

export default async function (req, res, next) {

    // console.log(process.env.AccessTokenKey);
    // console.log(process.env.RefreshTokenKey);

    try {
        const { Authorization1,Authorization2 } = req.cookies;
        const [tokentype1, token1] = Authorization1.split(" ");
        const [tokentype2, token2] = Authorization2.split(" ");

        //token타입을 검증
        if (tokentype1 !== "Bearer") return res.status(403).json({ ErrorMessage: "토큰 타입이 일치하지 않습니다" });
        if (tokentype2 !== "Bearer") return res.status(403).json({ ErrorMessage: "토큰 타입이 일치하지 않습니다" });

        //Access_token확인
        const AcessToken = jwt.verify(token1,process.env.AccessTokenKey);    //env에 존재하는 secrt key와 비슷한지 분석
        const RefreshToken = jwt.verify(token2,process.env.RefreshTokenKey);
        

        const userId = AcessToken;

        const user = await prisma.users.findFirst({
            where: {
                userId: +userId
            }
        });

        if (!user) return res.status(404).json({ ErrorMessage: "존재하지 않는 사용자" });


        //객체에서 중요한 정보들은 모두 제거
        delete user.createdAt;
        delete user.updatedAt;
        delete user.password;
        
        //정보들을 쿠키에 저장
        req.user = user;

        if (user.role === "Manager") req.manager = 1;

        next();


    }
    catch (error) {
        res.clearCookie('Authorization1');
        console.log(error.name);
        switch (error.name) {
            case 'TokenExpiredError':
                return res.status(401).json({ message: "토큰이 만료되었습니다." });
        }
        return res.status(403).json("token 관련 문제입니다!");
    }

}