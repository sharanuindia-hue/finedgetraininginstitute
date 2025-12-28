import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  try {
    const data = req.body;

    if (!data.name || !data.email || !data.phone || !data.interest) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // ADMIN MAIL
    await resend.emails.send({
      from: "FinEdge <info@finedgetraininginstitute.com>",
      to: ["info@finedgetraininginstitute.com"],
      subject: "New Admission Application",
      html: `
        <h3>Admission Application</h3>
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Phone:</b> ${data.phone}</p>
        <p><b>Course:</b> ${data.interest}</p>
        <p><b>Batch:</b> ${data.preferred_batch}</p>
      `
    });

    // USER CONFIRMATION
    await resend.emails.send({
      from: "FinEdge <info@finedgetraininginstitute.com>",
      to: [data.email],
      subject: "Application Received – FinEdge",
      html: `
        <p>Dear ${data.name},</p>
        <p>Your application for <b>${data.interest}</b> has been received.</p>
        <p>Our team will contact you shortly.</p>
        <br>
        <p>Regards,<br>FinEdge Team</p>
      `
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("APPLY FORM ERROR:", err);
    return res.status(500).json({ success: false });
  }
}
