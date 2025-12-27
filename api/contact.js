import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, phone, program, message } = req.body;

  if (!name || !email || !phone || !program || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.titan.email",
    port: 465,
    secure: true,
    auth: {
      user: process.env.TITAN_EMAIL,
      pass: process.env.TITAN_PASSWORD
    }
  });

  // ADMIN MAIL
  await transporter.sendMail({
    from: `Website <${process.env.TITAN_EMAIL}>`,
    to: process.env.TITAN_EMAIL,
    subject: "New Contact Enquiry",
    html: `
      <b>Name:</b> ${name}<br>
      <b>Email:</b> ${email}<br>
      <b>Phone:</b> ${phone}<br>
      <b>Program:</b> ${program}<br><br>
      <b>Message:</b><br>${message}
    `
  });

  // AUTO REPLY
  await transporter.sendMail({
    from: `FinEdge <${process.env.TITAN_EMAIL}>`,
    to: email,
    subject: "We received your enquiry",
    html: `
      Hi ${name},<br><br>
      Thank you for contacting FinEdge Training Institute.
      Our team will contact you shortly.<br><br>
      Regards,<br>FinEdge Team
    `
  });

  res.json({ success: true });
}
