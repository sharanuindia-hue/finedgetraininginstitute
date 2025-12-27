import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    name,
    dob,
    gender,
    nationality,
    phone,
    email,
    current_address,
    permanent_address,
    parent_name,
    parent_relationship,
    institution,
    year_of_passing,
    marks,
    preferred_batch,
    duration,
    interest,
    course_fee,
    net_payable
  } = req.body;

  if (!name || !dob || !gender || !nationality || !phone || !email || !institution || !year_of_passing || !preferred_batch || !interest) {
    return res.status(400).json({ message: "Missing required fields" });
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

    // ADMIN EMAIL
    await transporter.sendMail({
      from: `"New Admission Application" <${process.env.TITAN_EMAIL}>`,
      to: "info@finedgetraininginstitute.com",
      subject: "New Admission Application Received",
      html: `<h3>Admission Application Details</h3>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Course:</b> ${interest}</p>
      <p><b>Preferred Batch:</b> ${preferred_batch}</p>`
    });

    // USER EMAIL
    await transporter.sendMail({
      from: `"FinEdge Training Institute" <${process.env.TITAN_EMAIL}>`,
      to: email,
      subject: "Application Received – FinEdge Training Institute",
      html: `<p>Dear ${name},</p>
      <p>Thank you for submitting your admission application.</p>
      <p>Our admissions team will contact you shortly.</p>`
    });

    // ✅ Return success + trigger payment modal
    return res.status(200).json({ 
      message: "Application submitted successfully",
      showPaymentModal: true,
      paymentData: {
        baseAmount: course_fee || 50000,
        gst: course_fee ? course_fee * 0.18 : 9000,
        total: course_fee ? course_fee * 1.18 : 59000
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to send application email" });
  }
}
