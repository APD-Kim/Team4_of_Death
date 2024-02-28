import CustomError from '../utils/errorHandler.js';
import { prisma } from '../utils/prisma.js';

export const verifiedEmail = async (req, res, next) => {
    try {
        // auth미들웨어의
        // req.user를 통해 접근하려고 했던건데
        // 접근이 되지 않습니다..
        // 토큰이 없다고 auth 미들웨어에서 오류가 발생하는데
        // cookie로 저장해주지 않아 발생하는 문제 같습니다.
        // 강의에 나온 대로 저장된 사용자를 찾아 인증 여부를 확인해주는 코드인데
        // 쉽지 않았습니다.
        const userId = req.user.userId;

        const user = await prisma.users.findUnique({
            where: {
                userid: userId
            }
        });

        if (!user || user.isVerified === false) {
            throw new CustomError(403, '이메일 인증이 완료되지 않았습니다.');
        } 
        next();
    } catch (err) {
        next(err);
    }
};
