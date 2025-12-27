let OTP_STORE = {};

import nodemailer from "nodemailer";

export default async function handler(req, res) {
  const { name, email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);
  OTP_STORE[email] = otp;

  const transporter = nodemailer.createTransport({
    host: "smtp.titan.email",
    port: 465,
    secure: true,
    auth: {
      user: process.env.TITAN_EMAIL,
      pass: process.env.TITAN_PASSWORD
    }
  });

  await transporter.sendMail({
    from: `FinEdge <${process.env.TITAN_EMAIL}>`,
    to: email,
    subject: "Your OTP for Brochure Download",
    html: `
      Hi ${name},<br><br>
      Your OTP is <b>${otp}</b>.<br>
      Valid for 5 minutes.<br><br>
      FinEdge Team
    `
  });

  res.json({ success: true });
}

export { OTP_STORE };
