import cookieParser from "cookie-parser";
import express from "express";
import jwt from "jsonwebtoken";

//routes
import userRouter from "./routes/user.router.js";

//middlewares


const app=express();
const PORT=3019;

app.use(cookieParser());


app.use('',[userRouter]);

app.listen(PORT,()=>{
    console.log(`${PORT}번 포트로 서버가 열렸습니다.`);
});