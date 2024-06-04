import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";
import jwt from "jsonwebtoken";

//routes
import userRouter from "./routes/user.router.js";

//middlewares
import errorhandlerMiddleware from "./middlewares/errorhandler.middleware.js";

const app=express();
app.use(express.json());
app.use(urlencoded({extendeds:true}));

const PORT=3019;


app.use(cookieParser());


app.use('',[userRouter]);

app.use(errorhandlerMiddleware);

app.listen(PORT,()=>{
    console.log(`${PORT}번 포트로 서버가 열렸습니다.`);
});