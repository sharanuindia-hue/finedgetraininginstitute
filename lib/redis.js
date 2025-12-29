import Redis from "ioredis";

const redis = new Redis(process.env.OTP_REDIS_URL);

export default redis;
