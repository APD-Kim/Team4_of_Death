import jwt from "jsonwebtoken"
import CustomError from "../utils/errorHandler.js"

export const authJwt = async (req, res, next) => {
  try {
    const token = req.cookies.authorization;
    if (!token) throw new CustomError(401, "토큰이 없습니다.");
    const [tokenType, tokenValue] = token.split(" ");
    if (tokenType !== "Bearer") {
      throw new CustomError(401, "형식이 올바르지 않습니다.");
    }
    const verifyToken = jwt.verify(tokenValue, process.env.SECRET_KEY);
    if (verifyToken.userId === undefined) {
      throw new CustomError(401, "사용자 정보가 존재하지 않습니다.");
    }
    req.user = verifyToken;
    next();
  } catch (err) {
    if (err.message === "jwt expired") {
      err.statusCode = 401
      err.message = "토큰이 만료되었습니다."
    }
    if (err.message === "invalid token") {
      err.statusCode = 401
      err.message = "유효하지 않은 토큰입니다."
    }
    next(err)
  }
}