import jwt from 'jsonwebtoken';
import CustomError from '../utils/errorHandler.js';
import { prisma } from '../utils/prisma.js';

export const authJwt = async (req, res, next) => {
  try {
    const token = req.cookies.authorization;
    if (!token) throw new CustomError(401, '토큰이 없습니다.');
    const [tokenType, tokenValue] = token.split(' ');
    if (tokenType !== 'Bearer') {
      throw new CustomError(401, '형식이 올바르지 않습니다.');
    }
    const verifyToken = jwt.verify(tokenValue, process.env.SECRET_KEY);
    if (verifyToken.userId === undefined) {
      throw new CustomError(401, '사용자 정보가 존재하지 않습니다.');
    }

    
    const emailVefiedToken = req.cookies.isEmailVerified;
    if (!emailVefiedToken) {
      const user = await prisma.users.findUnique({
        where: {
          userId: verifyToken.userId,
        },
      });
      if (user.isVerified === false) {
        throw new CustomError(403, '이메일 인증이 완료되지 않았습니다.');
      } else {
        //만약 토큰은 없는데 isTrainer가 true라면
        const emailVerificationToken = jwt.sign({ verify: true }, process.env.SECRET_KEY, { expiresIn: '7d' });
        const BearerToken = `Bearer ${emailVerificationToken}`;
        res.cookie('isEmailVerified', BearerToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        });
      }
    } else {
      //만약 토큰이 있다면
      const [tokenType, tokenValue] = emailVefiedToken.split(' ');
      if (tokenType !== 'Bearer') {
        throw new CustomError(401, '형식이 올바르지 않습니다.');
      }
      const emailVerificationToken = jwt.verify(tokenValue, process.env.SECRET_KEY);
      if (emailVerificationToken.verify !== true) {
        throw new CustomError(401, '잘못된 토큰입니다.');
      }
    }
    req.user = verifyToken;
    next();
  } catch (err) {
    if (err.message === 'jwt expired') {
      err.statusCode = 401;
      err.message = '토큰이 만료되었습니다.';
    }
    if (err.message === 'invalid token') {
      err.statusCode = 401;
      err.message = '유효하지 않은 토큰입니다.';
    }
    next(err);
  }
};
