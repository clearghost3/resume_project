import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma/index.js";

//액세스 토큰 재생성 함수
function createAccesToken(Id) {
  const AccessToken = jwt.sign({ Id: +Id }, process.env.AccessTokenKey, {
    expiresIn: "6s",
  });
  return AccessToken;
}
//리프레션 토큰 재생성 함수
function createRefreshToken(Id) {
  const RefreshToken = jwt.sign({ Id: +Id }, process.env.RefreshTokenKey, {
    expiresIn: "7h",
  });
  return RefreshToken;
}

//토큰 검증 함수
function validateToken(token, secretKey) {
  try {
    const payload = jwt.verify(token, secretKey);
    return payload;
  } catch (err) {
    if (err.name==='TokenExpiredError') {
      return {expired:true};
    }
    return null;
  }
}

export default async function (req, res, next) {
  try {
    const AccessTokenKey=process.env.AccessTokenKey;
    const RefreshTokenKey=process.env.RefreshTokenKey;



    const {Authorization1,Authorization2}=req.cookies;

    //토큰을 타입과 토큰으로 분리
    console.log("1:",Authorization1,"2:",Authorization2);
    
    const [AccessTokenType,AccessToken]=Authorization1.split(" ");
    const [RefreshTokenType,RefreshToken]=Authorization2.split(" ");


    //토큰 타입을 검증
    if (AccessTokenType!=="Bearer") return res.status(403).json(`AccessToken의 타입이 다릅니다!`);
    if (RefreshTokenType!=="Bearer") return res.status(403).json(`RefreshToken의 타입이 다릅니다!`);
  console.log(1);
    //토큰 decode
    const decodedAccessToken= validateToken(AccessToken,AccessTokenKey);
    const decodedRefreshToken= validateToken(RefreshToken,RefreshTokenKey);

    //둘다 토큰이 만료되었거나 적합하지 않은 경우
    
    if (!decodedAccessToken&&!decodedRefreshToken) throw new Error("Unvailable_Token");

    let userId=0;
    
    //AccessToken이 만료된 경우
    if (AccessToken&&AccessToken.expired) {
      userId=decodedRefreshToken.Id;
      const newAccessToken= createAccesToken(userId);
      res.cookie("Authorization1",`Bearer ${newAccessToken}`,{
        maxAge: 1000*6,
      });
    }
    //RefreshTokne이 만료된 경우
    if (RefreshToken&&RefreshToken.expired) {
      userId=decodedAccessToken.Id;
      const newRefreshToken=createRefreshToken(userId);
      res.cookie("Authorization2",`Bearer ${newRefreshToken}`,{
        maxAge: 1000 * 60*60*7,});
    }


    console.log(2);

    
    console.log("userId:",userId)
    //토큰이 가리키는 유저에 관한 정보를 찾고 req에 저장
    const user=await prisma.users.findFirst({
      where: {
        userId:+userId
      }
    });

    req.user=user;

    next();
  }
  catch (err) {
    console.log(err.name);
    return res.status(400).json({ErrorMessage:"에러발생"});
  }

}