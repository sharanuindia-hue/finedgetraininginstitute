import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const otpStore = new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, name } = req.body;
  if (!email) return res.status(400).json({ success: false });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

  await resend.emails.send({
    from: "FinEdge <info@finedgetraininginstitute.com>",
    to: [email],
    subject: "Your OTP – FinEdge",
    html: `
      <p>Dear ${name || "User"},</p>
      <p>Your OTP is:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for 5 minutes.</p>
    `
  });

  res.json({ success: true });
}
