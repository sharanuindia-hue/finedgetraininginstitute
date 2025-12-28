import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// keep OTP store global (Vercel-safe for short flows)
global.otpStore = global.otpStore || new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    global.otpStore.set(email, {
      otp,
      expires: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    /* ===============================
       1️⃣ USER OTP EMAIL
    =============================== */
    await resend.emails.send({
      from: "FinEdge <info@finedgetraininginstitute.com>",
      to: [email],
      subject: "OTP for Brochure Download – FinEdge",
      html: `
        <p>Dear ${name},</p>
        <p>Your OTP for downloading the brochure is:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 5 minutes.</p>
        <br>
        <p>Regards,<br>FinEdge Training Institute</p>
      `
    });

    /* ===============================
       2️⃣ ADMIN LEAD EMAIL
    =============================== */
    await resend.emails.send({
      from: "FinEdge <info@finedgetraininginstitute.com>",
      to: ["info@finedgetraininginstitute.com"], // admin mail
      subject: "New Brochure Download Lead (OTP Requested)",
      html: `
        <h3>Brochure Download Request</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Time:</b> ${new Date().toLocaleString()}</p>
      `
    });

    return res.json({ success: true });

  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}
