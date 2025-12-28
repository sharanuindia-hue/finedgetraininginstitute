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
let generatedOTP = null;
let otpExpiresAt = null;

/* SEND OTP */
document.getElementById("sendOtpBtn")?.addEventListener("click", async () => {
  const email = otpEmail.value;
  const name = otpName.value;

  if (!email) {
    alert("Enter email");
    return;
  }

  generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  otpExpiresAt = Date.now() + 5 * 60 * 1000;

  const res = await fetch("/api/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      name,
      otp: generatedOTP
    })
  }).then(r => r.json());

  if (res.success) {
    alert("OTP sent to your email");
    document.getElementById("otpVerifySection")?.classList.remove("d-none");
  } else {
    alert("Failed to send OTP");
  }
});

/* VERIFY OTP */
document.getElementById("verifyOtpBtn")?.addEventListener("click", () => {
  const enteredOtp = otpInput.value.trim();

  if (!generatedOTP) {
    alert("Request OTP first");
    return;
  }

  if (Date.now() > otpExpiresAt) {
    alert("OTP expired");
    generatedOTP = null;
    return;
  }

  if (enteredOtp === generatedOTP) {
    const a = document.createElement("a");
    a.href =
      "https://www.finedgetraininginstitute.com/boucher/Finedge-Brochure.pdf";
    a.download = "Finedge-Brochure.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    alert("Invalid OTP");
  }
});
