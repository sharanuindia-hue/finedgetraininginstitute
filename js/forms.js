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

document.addEventListener("DOMContentLoaded", () => {

  const otpName = document.getElementById("otpName");
  const otpEmail = document.getElementById("otpEmail");
  const otpPhone = document.getElementById("otpPhone");
  const otpInput = document.getElementById("otpInput");

  const sendOtpBtn = document.getElementById("sendOtpBtn");
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");

  // SEND OTP
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

    try {
      const res = await fetch("/api/otp-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone })
      });

      const data = await res.json();

      if (data.success) {
        alert("OTP sent to your email");
        document.getElementById("otpVerifySection").classList.remove("d-none");
      } else {
        alert(data.message || "Failed to send OTP");
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }

    sendOtpBtn.disabled = false;
    sendOtpBtn.innerText = "Send OTP";
  });


  // VERIFY OTP
  verifyOtpBtn?.addEventListener("click", async () => {

    const email = otpEmail.value.trim();
    const otp = otpInput.value.trim();

    if (!otp) {
      alert("Enter OTP");
      return;
    }

    try {
      const res = await fetch("/api/otp-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();

      if (data.success) {
        window.location.href =
          "https://www.finedgetraininginstitute.com/boucher/Finedge-Brochure.pdf";
      } else {
        alert(data.message || "Invalid OTP");
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }

  });

});

const sendApplyOtpBtn = document.getElementById("sendApplyOtpBtn");
const verifyApplyOtpBtn = document.getElementById("verifyApplyOtpBtn");
const applyOtpSection = document.getElementById("applyOtpSection");
const applyOtpInput = document.getElementById("applyOtpInput");
const submitApplyBtn = document.getElementById("submitApplyBtn");

let verified = false;


// SEND OTP
sendApplyOtpBtn.addEventListener("click", async () => {

  const formData = new FormData(applyForm);

  const name = formData.get("name")?.trim();
  const email = formData.get("email")?.trim();
  const phone = formData.get("phone")?.trim();

  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Phone:", phone);

  if (!name || !email || !phone) {
    alert("Please enter name, email and phone");
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
      email,
      phone
    })
  }).then(r => r.json());

  if (res.success) {
    alert("OTP sent to your email");
     applyOtpSection.classList.remove("d-none");

  startOtpTimer(); 
  } else {
    alert(res.message || "Failed to send OTP");
  }

  sendApplyOtpBtn.disabled = false;
  sendApplyOtpBtn.innerText = "Send OTP";
});


// VERIFY OTP
verifyApplyOtpBtn.addEventListener("click", async () => {

  const email = document.querySelector('#applyForm input[name="email"]').value.trim();
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
const resendOtpBtn = document.getElementById("resendOtpBtn");
const otpTimer = document.getElementById("otpTimer");

let timerInterval;

function startOtpTimer() {

  let time = 60;

  resendOtpBtn.classList.add("d-none");
  otpTimer.classList.remove("d-none");

  timerInterval = setInterval(() => {

    otpTimer.innerText = `Resend OTP in ${time}s`;

    time--;

    if (time < 0) {

      clearInterval(timerInterval);

      otpTimer.classList.add("d-none");
      resendOtpBtn.classList.remove("d-none");

    }

  }, 1000);

}