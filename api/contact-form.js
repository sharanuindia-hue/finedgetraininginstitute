import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const { name, email, phone, program, message } = req.body;

    // Basic validation
    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Check env variables
    if (!process.env.TITAN_EMAIL || !process.env.TITAN_PASSWORD) {
      console.error("Missing TITAN_EMAIL or TITAN_PASSWORD");
      return res.status(500).json({
        success: false,
        message: "Server email configuration error"
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.titan.email",
      port: 465,
      secure: true,
      auth: {
        user: process.env.TITAN_EMAIL,
        pass: process.env.TITAN_PASSWORD
      }
    });

    // Send admin email
    await transporter.sendMail({
      from: `"Website Contact Form" <${process.env.TITAN_EMAIL}>`,
      to: "info@finedgetraininginstitute.com",
      subject: "New Contact Form Submission",
      html: `
        <h3>New Enquiry</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Program:</b> ${program || "-"}</p>
        <p><b>Message:</b><br/>${message}</p>
      `
    });

    // Success response
    return res.status(200).json({
      success: true,
      message: "Contact form submitted successfully"
    });

  } catch (error) {
    console.error("CONTACT FORM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}
