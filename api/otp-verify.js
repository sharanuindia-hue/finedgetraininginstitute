import redis from "../lib/redis";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false });
  }

  const savedOtp = await redis.get(`otp:${email}`);

  if (!savedOtp) {
    return res.json({ success: false, message: "OTP expired or not found" });
  }

  if (savedOtp !== otp) {
    return res.json({ success: false, message: "Invalid OTP" });
  }

  await redis.del(`otp:${email}`);

  res.json({ success: true });
}
