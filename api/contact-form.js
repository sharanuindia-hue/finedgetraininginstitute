import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { name, email, phone, message, program } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    /* ================= ADMIN EMAIL ================= */
    await resend.emails.send({
      from: "FinEdge <info@finedgetraininginstitute.com>",
      to: ["info@finedgetraininginstitute.com"],
      reply_to: email,   // ✅ correct field name
      subject: "New Contact Form Submission",
      html: `
        <h3>Contact Details</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Program:</b> ${program || "-"}</p>
        <p><b>Message:</b> ${message}</p>
      `
    });

    /* ================= USER CONFIRMATION ================= */
    await resend.emails.send({
      from: "FinEdge <info@finedgetraininginstitute.com>",
      to: [email],
      subject: "Application Received – FinEdge Training Institute",
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for contacting <b>FinEdge Training Institute</b>.</p>
        <p>We have received your enquiry${program ? ` for <b>${program}</b>` : ""}.</p>
        <p>Our team will get in touch with you shortly.</p>
        <br>
        <p>Warm regards,<br>
        <b>FinEdge Training Institute</b><br>
        (A Unit of FinCareer Edtech Technologies Pvt. Ltd.)</p>
      `
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("CONTACT FORM ERROR:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
