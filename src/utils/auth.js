import nodemailer from 'nodemailer';
import { redisClient } from '../model/redis.js';

import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: process.env.EMAILSERVICE,
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.USERMAIL,
    pass: process.env.USERPASS,
  },
});

export const sendMail = async (email, verificationCode) => {
  const mailOptions = {
    from: 'petsitter@gmail.com',
    to: email,
    subject: 'Pet-Sitter 회원가입 인증코드 입니다.',
    html: `안녕하세요 ${email}님 회원 가입을 위한 이메일 인증 코드 입니다.
            <br></br>
            <p>${verificationCode}</p>`,
  };

  redisClient.setEx(email, 300, verificationCode);

  await transporter.sendMail(mailOptions);
};
