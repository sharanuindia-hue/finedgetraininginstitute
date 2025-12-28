import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const {
      name,
      email,
      phone,
      interest,
      preferred_batch,
      amount,
      payment_id
    } = req.body;

    if (!payment_id || !email) {
      return res.status(400).json({ success: false });
    }

    /* ================= ADMIN PAYMENT MAIL ================= */
    await resend.emails.send({
      from: "FinEdge <info@finedgetraininginstitute.com>",
      to: ["info@finedgetraininginstitute.com"],
      subject: "Payment Received – FinEdge",
      html: `
        <h3>Payment Confirmation</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Course:</b> ${interest}</p>
        <p><b>Batch:</b> ${preferred_batch}</p>
        <p><b>Amount Paid:</b> ₹${amount}</p>
        <p><b>Razorpay Payment ID:</b> ${payment_id}</p>
      `
    });

    /* ================= USER PAYMENT MAIL ================= */
    await resend.emails.send({
      from: "FinEdge <info@finedgetraininginstitute.com>",
      to: [email],
      subject: "Payment Successful – FinEdge",
      html: `
        <p>Dear ${name},</p>
        <p>We have successfully received your payment.</p>

        <p><b>Course:</b> ${interest}</p>
        <p><b>Amount Paid:</b> ₹${amount}</p>
        <p><b>Payment ID:</b> ${payment_id}</p>

        <p>Our team will contact you shortly with further instructions.</p>

        <br>
        <p>Regards,<br><b>FinEdge Team</b></p>
      `
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("PAYMENT MAIL ERROR:", err);
    return res.status(500).json({ success: false });
  }
}
