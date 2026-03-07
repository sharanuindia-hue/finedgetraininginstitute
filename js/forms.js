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
  applyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(applyForm));

    try {
      const res = await fetch("/api/apply-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {

        // Redirect to thank you page
        window.location.href = "/Thank-you.html";

      } else {
        alert("Submission failed. Please try again.");
      }

    } catch (err) {
      console.error(err);
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

  const res = await fetch("/api/otp-verify", {
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


const sendApplyOtpBtn = document.getElementById("sendApplyOtpBtn");
const verifyApplyOtpBtn = document.getElementById("verifyApplyOtpBtn");
const applyOtpSection = document.getElementById("applyOtpSection");
const applyOtpInput = document.getElementById("applyOtpInput");

let verified = false;


sendApplyOtpBtn.addEventListener("click", async () => {

  const formData = new FormData(applyForm);

  const name = formData.get("name")?.trim();
  const email = formData.get("email")?.trim();

  console.log("Name:", name);
  console.log("Email:", email);

  if (!name || !email) {
    alert("Please enter name and email");
    return;
  }

  sendApplyOtpBtn.disabled = true;
  sendApplyOtpBtn.innerText = "Sending...";

  const res = await fetch("/api/otp-send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      email
    })
  }).then(r => r.json());

  if (res.success) {
    alert("OTP sent to your email");
    document.getElementById("applyOtpSection").classList.remove("d-none");
  } else {
    alert(res.message || "Failed to send OTP");
  }

  sendApplyOtpBtn.disabled = false;
  sendApplyOtpBtn.innerText = "Send OTP";
});


// VERIFY OTP
verifyApplyOtpBtn.addEventListener("click", async () => {

  const email = document.querySelector('input[name="email"]').value.trim();
  const otp = applyOtpInput.value.trim();

  if (!otp) {
    alert("Enter OTP");
    return;
  }

  const res = await fetch("/api/otp-verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      otp
    })
  }).then(r => r.json());

  if (res.success) {
    submitApplyBtn.disabled = false;   

    sendApplyOtpBtn.disabled = true;
    verifyApplyOtpBtn.disabled = true;
    verified = true;
    alert("OTP verified successfully");

    applyOtpSection.classList.add("d-none");
    sendApplyOtpBtn.disabled = true;

  } else {
    alert(res.message || "Invalid OTP");
  }

});


// FORM SUBMIT CHECK
document.getElementById("applyForm").addEventListener("submit", function(e) {

  if (!verified) {
    e.preventDefault();
    alert("Please verify OTP before submitting the form");
  }

});