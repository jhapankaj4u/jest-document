import Redis from 'ioredis';
import * as dotenv from 'dotenv';

dotenv.config();
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT,
   
});
console.log(redis)
export default redis;