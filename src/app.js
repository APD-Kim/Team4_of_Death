import express from 'express';
import cookieParser from 'cookie-parser';
import userRouter from './routes/users.routes.js';
import reviewRouter from './routes/reviews.routes.js';
import reservationRouter from './routes/reservations.routes.js';
import trainersRouter from '../src/routes/trainers.routes.js';
import pointRouter from '../src/routes/points.routes.js';

import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/users', userRouter);
app.use('/reviews', reviewRouter);
app.use('/trainers', trainersRouter);
app.use('/reservations', reservationRouter);
app.use('/points', pointRouter);

app.use((err, req, res, next) => {
  console.log(err.stack);
  const status = err.statusCode ?? 500;
  const message = err.message ?? '서버 에러 발생';
  const boolean = err.boolean ?? false;
  res.status(status).json({ success: boolean, message: message });
});

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.listen(process.env.PORT, () => {
  console.log(`${process.env.PORT}번 포트로 서버 실행중`);
});
