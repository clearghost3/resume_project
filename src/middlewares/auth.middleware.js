import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma/index.js";

function createAccesToken(id) {
  const AccessToken = jwt.sign({ id: +id }, process.env.AccessTokenKey, {
    expiresIn: "7s",
  });
  return AccessToken;
}

function createRefreshToken(id) {
  const RefreshToken = jwt.sign({ id: +id }, process.env.RefreshTokenKey, {
    expiresIn: "7h",
  });
  return RefreshToken;
}

function validateToken(token, secretKey) {
  try {
    const payload = jwt.verify(token, secretKey);
    return payload;
  } catch (err) {
    return null;
  }
}

export default async function (req,res,next) {
    
}