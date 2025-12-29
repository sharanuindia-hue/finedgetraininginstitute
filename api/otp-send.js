import redis from "../lib/redis";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, phone } = req.body;
  if (!email || !phone) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP for 5 minutes
  await redis.set(`otp:${email}`, otp, "EX", 300);

  // USER MAIL
  await resend.emails.send({
    from: "FinEdge <info@finedgetraininginstitute.com>",
    to: [email],
    subject: "Your OTP – FinEdge",
    html: `
      <p>Dear ${name || "User"},</p>
      <h2>${otp}</h2>
      <p>OTP valid for 5 minutes</p>
    `
  });

  // ADMIN MAIL
  await resend.emails.send({
    from: "FinEdge <info@finedgetraininginstitute.com>",
    to: ["info@finedgetraininginstitute.com"],
    subject: "Brochure OTP Requested",
    html: `
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p>
    `
  });

  res.json({ success: true });
}
