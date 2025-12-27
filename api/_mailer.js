import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.titan.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Finedge Training Institute" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: req.body.subject,
      text: req.body.message,
    });

    // auto reply
    await transporter.sendMail({
      from: `"Finedge Training Institute" <${process.env.EMAIL_USER}>`,
      to: req.body.email,
      subject: "Thank you for contacting Finedge",
      text: "We received your request. Our team will contact you shortly.",
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Mail failed" });
  }
}
