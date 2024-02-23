import express from "express";
import cookieParser from "cookie-parser";
import { redisClient } from "./model/redis.js"

import "dotenv/config";
import CustomError from "./utils/errorHandler.js";




const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(redisClient)

//이 위로 app.use()를 넣어주세요
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? "서버 에러 발생";
  const boolean = err.boolean ?? false;
  res.status(statusCode).json({ success: boolean, message: message });
});

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log(`${process.env.PORT}번 포트로 서버 실행중`);
});
