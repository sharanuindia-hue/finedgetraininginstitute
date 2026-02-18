import Redis from "ioredis";

const redisUrl = process.env.OTP_REDIS_URL_NEW;

if (!redisUrl) {
  throw new Error("OTP_REDIS_URL_NEW is missing");
}

const redis = new Redis(redisUrl);

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});

export default redis;
