import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  try {
    const d = req.body;

    // Basic required validation
    if (
      !d.name ||
      !d.email ||
      !d.phone ||
      !d.dob ||
      !d.gender ||
      !d.nationality ||
      !d.institution ||
      !d.year_of_passing ||
      !d.preferred_batch ||
      !d.interest
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    /* ================= ADMIN MAIL ================= */
    await resend.emails.send({
      from: "FinEdge <info@finedgetraininginstitute.com>",
      to: ["info@finedgetraininginstitute.com"],
      subject: "New Admission Application",
      html: `
        <h3>Admission Application</h3>

        <h4>Personal Information</h4>
        <p><b>Name:</b> ${d.name}</p>
        <p><b>DOB:</b> ${d.dob}</p>
        <p><b>Gender:</b> ${d.gender}</p>
        <p><b>Nationality:</b> ${d.nationality}</p>
        <p><b>Phone:</b> ${d.phone}</p>
        <p><b>Email:</b> ${d.email}</p>

        <h4>Address</h4>
        <p><b>Current:</b> ${d.current_address}</p>
        <p><b>Permanent:</b> ${d.permanent_address || "Same as current"}</p>

        <h4>Parent / Guardian</h4>
        <p><b>Name:</b> ${d.parent_name || "-"}</p>
        <p><b>Relationship:</b> ${d.parent_relationship || "-"}</p>

        <h4>Education</h4>
        <p><b>Institution:</b> ${d.institution}</p>
        <p><b>Year of Passing:</b> ${d.year_of_passing}</p>
        <p><b>Marks:</b> ${d.marks || "-"}</p>

        <h4>Program Details</h4>
        <p><b>Course:</b> ${d.interest}</p>
        <p><b>Preferred Batch:</b> ${d.preferred_batch}</p>
        <p><b>Duration:</b> ${d.duration || "-"}</p>
        <p><b>Course Fee:</b> ${d.course_fee || "-"}</p>
        <p><b>Net Payable:</b> ${d.net_payable || "-"}</p>
      `
    });

    /* ================= USER CONFIRMATION ================= */
    await resend.emails.send({
      from: "FinEdge <info@finedgetraininginstitute.com>",
      to: [d.email],
      subject: "Application Received – FinEdge Training Institute",
      html: `
        <p>Dear ${d.name},</p>

        <p>Thank you for submitting your admission application.</p>

        <p><b>Course:</b> ${d.interest}</p>
        <p><b>Preferred Batch:</b> ${d.preferred_batch}</p>

        <p>Please proceed with the payment to complete your admission.</p>

        <br>
        <p>Regards,<br>FinEdge Admissions Team</p>
      `
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("APPLY FORM ERROR:", err);
    return res.status(500).json({ success: false });
  }
}
