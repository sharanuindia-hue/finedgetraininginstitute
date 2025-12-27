async function postData(url, data) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

/* CONTACT FORMS */
["contact-form-main", "contact-form-home"].forEach(id => {
  const form = document.getElementById(id);
  if (!form) return;

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const res = await postData("/api/contact-form", data);

    // Redirect to thank-you page after successful submission
    if (res.success !== false) {
      window.location.href = "/thank-you"; // <-- replace with your thank-you page
    } else {
      alert(res.message || "Submission failed");
    }
  });
});

/* APPLY FORM */
const applyForm = document.getElementById("applyForm");
if (applyForm) {
  applyForm.addEventListener("submit", async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(applyForm));

    const res = await postData("/api/apply-form", data);

    if (res.showPaymentModal) {
      // Set payment modal values
      const baseInput = document.getElementById("payBaseAmount");
      const gstInput = document.getElementById("payGST");
      const totalInput = document.getElementById("payTotal");

      baseInput.value = res.paymentData.baseAmount;
      gstInput.value = res.paymentData.gst;
      totalInput.value = res.paymentData.total;

      // Show the modal
      $("#paymentModal").modal("show");

      // Dynamic calculation if user changes base amount
      baseInput.addEventListener("input", () => {
        const base = parseFloat(baseInput.value) || 0;
        const gst = +(base * 0.18).toFixed(2);
        const total = +(base + gst).toFixed(2);
        gstInput.value = gst;
        totalInput.value = total;
      });

      applyForm.reset();

      // Optional: redirect after modal is closed
      $('#paymentModal').on('hidden.bs.modal', () => {
        window.location.href = "/thank-you"; // <-- replace with your thank-you page
      });
    } else {
      alert(res.message || "Application submitted successfully");
      window.location.href = "/thank-you"; // fallback redirect
    }
  });
}

/* OTP */
document.getElementById("sendOtpBtn")?.addEventListener("click", async () => {
  const name = otpName.value;
  const email = otpEmail.value;
  const res = await postData("/api/send-otp", { name, email });
  alert(res.message || "OTP sent");
});

document.getElementById("verifyOtpBtn")?.addEventListener("click", async () => {
  const email = otpEmail.value;
  const otp = otpInput.value;
  const res = await postData("/api/verify-otp", { email, otp });

  if (res.success) {
    // Redirect to brochure or thank-you page
    window.location.href = "https://www.finedgetraininginstitute.com/boucher/Finedge-Brochure.pdf";
  } else {
    alert("Invalid OTP");
  }
});
