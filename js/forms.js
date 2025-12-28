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
      window.location.href = "/thank-you.html";
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

    const res = await postData("/api/apply-form", data);
    if (res.success) {
      window.location.href = "/thank-you.html";
    } else {
      alert("Submission failed");
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
        window.location.href = "/thank-you.html";
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (err) {
      alert("Network error. Please try later.");
    }
  });
}
document.getElementById("sendOtpBtn")?.addEventListener("click", async () => {
  const email = otpEmail.value;
  const name = otpName.value;

  const res = await fetch("/api/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name })
  }).then(r => r.json());

  if (res.success) alert("OTP sent");
});

document.getElementById("verifyOtpBtn")?.addEventListener("click", async () => {
  const email = otpEmail.value;
  const otp = otpInput.value;

  const res = await fetch("/api/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp })
  }).then(r => r.json());

  if (res.success) {
    window.location.href = "/thank-you.html";
  } else {
    alert("Invalid OTP");
  }
});
