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
    if (res.success) {
      window.location.href = "/Thank-you.html";
    } else {
      alert("Something went wrong");
    }
  });
});

/* APPLY FORM */
const applyForm = document.getElementById("applyForm");

if (applyForm) {
  applyForm.addEventListener("submit", async e => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(applyForm));

    try {
      const res = await fetch("/api/apply-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(r => r.json());

      if (res.success) {
        // Open payment modal
        $("#paymentModal").modal("show");

        // Optional: prefill amount from form
        if (data.course_fee) {
          document.getElementById("payBaseAmount").value = data.course_fee;
          calculatePayment();
        }
      } else {
        alert("Submission failed. Please check details.");
      }

    } catch (err) {
      alert("Server error. Please try again later.");
    }
  });
}

const contactPopupForm = document.getElementById("contact-form-pop");

if (contactPopupForm) {
  contactPopupForm.addEventListener("submit", async e => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(contactPopupForm));

    try {
      const res = await fetch("/api/contact-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(r => r.json());

      if (res.success) {
        window.location.href = "/Thank-you.html";
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (err) {
      alert("Network error. Please try later.");
    }
  });
}

 const sendOtpBtn = document.getElementById("sendOtpBtn");
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");

  sendOtpBtn?.addEventListener("click", async () => {
    const name = otpName.value.trim();
    const email = otpEmail.value.trim();
    const phone = otpPhone.value.trim();

    if (!name || !email || !phone) {
      alert("Please fill all details");
      return;
    }

    sendOtpBtn.disabled = true;
    sendOtpBtn.innerText = "Sending...";

    const res = await fetch("/api/otp-send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone })
    }).then(r => r.json());

    if (res.success) {
      alert("OTP sent to your email");
      document.getElementById("otpVerifySection").classList.remove("d-none");
    } else {
      alert("Failed to send OTP");
    }

    sendOtpBtn.disabled = false;
    sendOtpBtn.innerText = "Send OTP";
  });

  document.getElementById("verifyOtpBtn").addEventListener("click", async () => {
  const email = otpEmail.value;
  const otp = otpInput.value;

  const res = await fetch("/api/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp })
  }).then(r => r.json());

  if (res.success) {
    window.location.href =
      "https://www.finedgetraininginstitute.com/boucher/Finedge-Brochure.pdf";
  } else {
    alert(res.message || "Invalid OTP");
  }
});

