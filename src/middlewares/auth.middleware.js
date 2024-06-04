import jwt from "jsonwebtoken";
import { prisma } from '../utils/prisma/index.js'

export default async function (req, res, next) {
    try {
        const { Authorization } = req.cookies;
        const [tokentype, token] = Authorization.split(" ");

        //token타입을 검증
        if (tokentype !== "Bearer") return res.status(403).json({ ErrorMessage: "토큰 타입이 일치하지 않습니다" });

        //로그인 한 직후가 아닐 때
        const decodedToken = jwt.verify(token, "First_Key");

        const userId = decodedToken;

        const user = await prisma.users.findFirst({
            where: {
                userId: +userId
            }
        });

        if (!user) return res.status(404).json({ ErrorMessage: "존재하지 않는 사용자" });

        req.user = user;

        if (user.role === "Manager") req.manager = 1;

        next();


    }
    catch (error) {
        res.clearCookie('Authorization');
        console.log(error.name);
        switch (error.name) {
            case 'TokenExpiredError':
                return res.status(401).json({ message: "토큰이 만료되었습니다." });
        }
        return res.status(403).json("token 관련 문제입니다!");
    }

}