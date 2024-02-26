import redis from 'redis';
import 'dotenv/config';

export const redisClient = redis.createClient({
  url: `${process.env.REDIS}`,
  legacyMode: true, // 반드시 설정 !!
});
redisClient.on('connect', () => {
  console.info('Redis connected!');
});
redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});
redisClient.connect().then();
export const redisCli = redisClient.v4;
