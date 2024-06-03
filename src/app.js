import cookieParser from "cookie-parser";
import express from "express";
import jwt from "jsonwebtoken";


const app=express();
const PORT=3019;


app.use(cookieParser());



app.listen(PORT,()=>{

});