import Redis from "ioredis";

const redis = new Redis(process.env.OTP_REDIS_URL_NEW);

export default redis;
