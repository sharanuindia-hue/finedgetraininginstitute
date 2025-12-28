import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, name, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false });
  }

  await resend.emails.send({
    from: "FinEdge <info@finedgetraininginstitute.com>",
    to: [email],
    subject: "Your OTP for Brochure Download",
    html: `
      <p>Dear ${name || "User"},</p>
      <p>Your OTP is:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for 5 minutes.</p>
    `
  });

  res.json({ success: true });
}
