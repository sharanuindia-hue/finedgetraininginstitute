import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, phone, program, message } = req.body;

  if (!name || !email || !phone || !program || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.titan.email",
      port: 465,
      secure: true,
      auth: {
        user: process.env.TITAN_EMAIL,
        pass: process.env.TITAN_PASSWORD
      }
    });

    // 🔹 Admin mail
    await transporter.sendMail({
      from: `"Popup Enquiry" <${process.env.TITAN_EMAIL}>`,
      to: "info@finedgetraininginstitute.com",
      subject: "New Popup Callback Request",
      html: `
        <h3>New Popup Enquiry</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Program:</b> ${program}</p>
        <p><b>Message:</b> ${message}</p>
      `
    });

    // 🔹 Auto reply to user
    await transporter.sendMail({
      from: `"FinEdge Training Institute" <${process.env.TITAN_EMAIL}>`,
      to: email,
      subject: "We received your request",
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for contacting FinEdge Training Institute.</p>
        <p>Our team will reach out to you shortly.</p>
        <br>
        <p>Regards,<br>FinEdge Team</p>
      `
    });

    return res.status(200).json({ message: "Popup enquiry sent" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Email sending failed" });
  }
}
