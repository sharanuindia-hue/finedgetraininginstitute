let generatedOTP = null;

/* ---------------------------------------------------------
   1. RAZORPAY PAYMENT HANDLER
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("applyForm");
  const payButton = document.getElementById("payButtonApply");

  const GST_RATE = 0.18;
  const baseInput = document.getElementById("baseAmount");
  const gstInput = document.getElementById("gstAmount");
  const totalInput = document.getElementById("totalAmount");

  function calculate() {
    const base = Number(baseInput.value || 0);
    const gst = Math.round(base * GST_RATE);
    const total = base + gst;

    gstInput.value = gst.toLocaleString("en-IN");
    totalInput.value = total.toLocaleString("en-IN");
    return total;
  }

  calculate();
  baseInput.addEventListener("input", calculate);

  function togglePayButton() {
    payButton.disabled = !form.checkValidity();
  }
  form.addEventListener("input", togglePayButton);
  form.addEventListener("change", togglePayButton);
  togglePayButton();

  payButton.addEventListener("click", async () => {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const totalAmount = calculate();
    if (totalAmount < 500) {
      alert("Invalid payment amount");
      return;
    }

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount })
      });

      const order = await res.json();
      if (!order.id) {
        alert("Order creation failed");
        return;
      }

      const options = {
        key: "rzp_live_RjGNUSpVFIuRog",
        amount: order.amount,
        currency: "INR",
        name: "FINEDGE Training Institute",
        description: "Program Fee + 18% GST",
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response)
          });

          const verifyData = await verifyRes.json();

          if (verifyData.verified) {
            alert("✅ Payment successful!");
          } else {
            alert("❌ Payment verification failed");
          }
        }
      };

      new Razorpay(options).open();

    } catch (err) {
      console.error(err);
      alert("Payment initiation failed");
    }
  });
});

/* ---------------------------------------------------------
   2. APPLY FORM (EmailJS)
--------------------------------------------------------- */
// document.addEventListener("DOMContentLoaded", function () {
//   const applyForm = document.getElementById("applyForm");

//   applyForm.addEventListener("submit", function (e) {
//     e.preventDefault();
//     if (!applyForm.checkValidity()) {
//       applyForm.reportValidity();
//       return;
//     }

//     const formData = new FormData(applyForm);
//     const params = Object.fromEntries(formData.entries());

//     // Admin email
//     const adminParams = {
//       ...params,
//       subject: "🎓 New Program Application",
//       message: `
// New application received:
// Name: ${params.name}
// Email: ${params.email}
// Phone: ${params.phone}
// Program: ${params.program}
// Message: ${params.message}`
//     };

//     // User email
//     const userParams = {
//       name: params.name,
//       email: params.email,
//       subject: "Application Received – Finedge",
//       message: `Hi ${params.name},\n\nThank you for applying for ${params.program}. Our team will review and contact you shortly.`
//     };

//     emailjs.send("service_724c1ef", "template_n5mq7jd", adminParams)
//       .then(() => emailjs.send("service_724c1ef", "template_n5mq7jd", userParams))
//       .then(() => {
//         window.location.href = "Thank-you.html";
//       })
//       .catch(err => {
//         console.error("APPLY ERROR", err);
//         alert("Application failed. Please try again.");
//       });
//   });
// });
// document.addEventListener("DOMContentLoaded", function () {
//   const forms = [
//     document.getElementById("contact-form"),
//     document.getElementById("contact-form-pop"),

//   ];

//   forms.forEach(form => {
//     if (!form) return;

//     form.addEventListener("submit", function (e) {
//       e.preventDefault();

//       if (!form.checkValidity()) {
//         form.reportValidity();
//         return;
//       }

//       const formData = new FormData(form);
//       const params = {
//         name: formData.get("name"),
//         email: formData.get("email"),
//         phone: formData.get("phone"),
//         program: formData.get("program"),
//         subject: "New Contact Enquiry",
//         message: `
// Program Interested: ${formData.get("program")}
// Message: ${formData.get("message")}
//         `
//       };

//       const btn = form.querySelector("button");
//       btn.disabled = true;
//       btn.innerText = "Sending...";


//       emailjs.send("service_724c1ef", "template_n5mq7jd", {
//         name: formData.get("name"),
//         email: formData.get("email"),
//         phone: formData.get("phone"),
//         program: formData.get("program"),
//         message: formData.get("message")
//       })
//         .then(() => {
//           return emailjs.send("service_724c1ef", "template_rohr2r4", {
//             name: formData.get("name"),
//             email: formData.get("email")
//           });
//         })
//         .then(() => {
//           const modal = form.closest(".modal");
//           if (modal) $(modal).modal("hide");

//           window.location.href = "thank-you.html";
//         })
//         .catch(err => {
//           console.error("EMAIL ERROR:", err);
//           alert("Submission failed. Please try again.");
//         })
//         .finally(() => {
//           btn.disabled = false;
//           btn.innerText = "Request Call Back";
//         });
//     });
//   });
// });

/* ---------------------------------------------------------
   3. CONTACT FORM (EmailJS)
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {

  /* =====================================================
     EMAILJS INIT
  ===================================================== */
  emailjs.init("5TP3xMNs4APsdgAgx");

  const SERVICE_ID       = "service_724c1ef";
  const ADMIN_TEMPLATE   = "template_rohr2r4";
  const USER_TEMPLATE    = "template_n5mq7jd";

  /* =====================================================
     1. CONTACT + APPLY FORMS
  ===================================================== */

  const forms = [
    { id: "contact-form", type: "contact" },
    { id: "contact-form-pop", type: "contact" },
    { id: "applyForm", type: "apply" }
  ];

  forms.forEach(({ id, type }) => {
    const form = document.getElementById(id);
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const fd = new FormData(form);
      let message = "";
      let subject = "";

      /* -------- BUILD MESSAGE -------- */
      if (type === "contact") {
        subject = "New Contact Enquiry";
        message = `
CONTACT ENQUIRY
----------------
Name    : ${fd.get("name")}
Email   : ${fd.get("email")}
Phone   : ${fd.get("phone")}
Program : ${fd.get("program")}

Message:
${fd.get("message")}
`;
      }

      if (type === "apply") {
        subject = "New Admission Application";
        message = `
ADMISSION APPLICATION
----------------------
Name        : ${fd.get("name")}
DOB         : ${fd.get("dob")}
Gender      : ${fd.get("gender")}
Nationality : ${fd.get("nationality")}

Phone       : ${fd.get("phone")}
Email       : ${fd.get("email")}

Current Address:
${fd.get("current_address")}

Permanent Address:
${fd.get("permanent_address") || "Same as current"}

Parent / Guardian:
${fd.get("parent_name") || "N/A"} (${fd.get("parent_relationship") || "N/A"})

Education:
${fd.get("institution")}
Year        : ${fd.get("year_of_passing")}
Marks       : ${fd.get("marks") || "N/A"}

Course      : ${fd.get("interest")}
Batch       : ${fd.get("preferred_batch")}
Duration    : ${fd.get("duration")}
Course Fee  : ${fd.get("course_fee")}
Net Payable : ${fd.get("net_payable")}
`;
      }

      const adminParams = {
        name: fd.get("name"),
        email: fd.get("email"),
        subject: subject,
        message: message
      };

      const userParams = {
        name: fd.get("name"),
        email: fd.get("email"),
        message: "Thank you for contacting Finedge. Our team will get back to you shortly."
      };

      const btn = form.querySelector("button[type='submit']");
      btn.disabled = true;
      btn.innerText = "Sending...";

      emailjs.send(SERVICE_ID, ADMIN_TEMPLATE, adminParams)
        .then(() => emailjs.send(SERVICE_ID, USER_TEMPLATE, userParams))
        .then(() => window.location.href = "Thank-you.html")
        .catch(err => {
          console.error("FORM ERROR:", err);
          alert("Submission failed. Please try again.");
        })
        .finally(() => {
          btn.disabled = false;
          btn.innerText = "Submit";
        });
    });
  });

  /* =====================================================
     2. OTP – BROCHURE DOWNLOAD
  ===================================================== */

  let generatedOTP = null;
  let otpExpiresAt = null;
  let otpCooldown  = false;

  const sendOtpBtn   = document.getElementById("sendOtpBtn");
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");

  /* -------- SEND OTP -------- */
  sendOtpBtn?.addEventListener("click", function () {

    if (otpCooldown) {
      alert("Please wait before requesting another OTP.");
      return;
    }

    const name  = document.getElementById("otpName").value.trim();
    const email = document.getElementById("otpEmail").value.trim();
    const phone = document.getElementById("otpPhone").value.trim();

    if (!name || !email || !phone) {
      alert("Please fill all fields");
      return;
    }

    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    otpExpiresAt = Date.now() + (5 * 60 * 1000); // 5 min expiry

    /* ---- ADMIN LOG ---- */
    emailjs.send(SERVICE_ID, ADMIN_TEMPLATE, {
      name: name,
      email: email,
      subject: "Brochure OTP Request",
      message: `
BROCHURE OTP REQUEST
--------------------
Name  : ${name}
Email : ${email}
Phone : ${phone}
OTP   : ${generatedOTP}
`
    });

    /* ---- USER OTP ---- */
    emailjs.send(SERVICE_ID, USER_TEMPLATE, {
      name: name,
      email: email,
      message: `Your OTP for brochure download is: ${generatedOTP}`
    })
    .then(() => {
      alert("OTP sent to your email");
      document.getElementById("otpVerifySection").classList.remove("d-none");

      otpCooldown = true;
      sendOtpBtn.disabled = true;

      let sec = 60;
      sendOtpBtn.innerText = `Wait ${sec}s`;

      const timer = setInterval(() => {
        sec--;
        sendOtpBtn.innerText = `Wait ${sec}s`;
        if (sec <= 0) {
          clearInterval(timer);
          otpCooldown = false;
          sendOtpBtn.disabled = false;
          sendOtpBtn.innerText = "Send OTP";
        }
      }, 1000);
    })
    .catch(err => {
      console.error("OTP ERROR:", err);
      alert("Failed to send OTP");
    });
  });

  /* -------- VERIFY OTP -------- */
  verifyOtpBtn?.addEventListener("click", function () {

    const enteredOtp = document.getElementById("otpInput").value.trim();

    if (!generatedOTP) {
      alert("Please request OTP first");
      return;
    }

    if (Date.now() > otpExpiresAt) {
      alert("OTP expired. Please request again.");
      generatedOTP = null;
      return;
    }

    if (enteredOtp === generatedOTP) {
      const a = document.createElement("a");
      a.href = "https://www.finedgetraininginstitute.com/boucher/Finedge-Brochure.pdf";
      a.download = "Finedge-Brochure.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert("Invalid OTP");
    }
  });

});


/* ---------------------------------------------------------
   5. MOBILE NAV MENU & DROPDOWN FIX
--------------------------------------------------------- */
// Open modal
document.getElementById("openBrochureModal").addEventListener("click", () => {
  $('#brochureModal').modal('show');
});

document.addEventListener("DOMContentLoaded", function () {

  let generatedOTP = null;

  const sendOtpBtn = document.getElementById("sendOtpBtn");
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");

  // ================= SEND OTP =================
  sendOtpBtn.addEventListener("click", function () {

    const name = document.getElementById("brochureName").value.trim();
    const email = document.getElementById("brochureEmail").value.trim();
    const phone = document.getElementById("brochurePhone").value.trim();

    if (!name || !email || !phone) {
      alert("Please fill all fields");
      return;
    }

    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", generatedOTP);

    emailjs.send(
      "service_724c1ef",
      "template_rohr2r4",
      {
        name: name,
        email: email,
        otp: generatedOTP
      }
    ).then(() => {
      alert("OTP sent to your email");
      document.getElementById("otpVerifySection").classList.remove("d-none");
    }).catch(err => {
      console.error(err);
      alert("Failed to send OTP");
    });

  });

  // ================= VERIFY OTP =================
  verifyOtpBtn.addEventListener("click", function () {

    const enteredOtp = document.getElementById("otpInput").value.trim();

    console.log("Entered OTP:", enteredOtp);
    console.log("Stored OTP:", generatedOTP);

    if (!generatedOTP) {
      alert("Please request OTP first");
      return;
    }

    if (enteredOtp === generatedOTP) {
      alert("OTP verified. Downloading brochure...");

      const a = document.createElement("a");
      a.href = "https://www.finedgetraininginstitute.com/boucher/Finedge-Brochure.pdf";
      a.download = "Finedge-Brochure.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert("Invalid OTP");
    }
  });

});

/* ---------------------------------------------------------
   5. MOBILE NAV MENU (Hamburger + Overlay)
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  const toggler = document.querySelector(".navbar-toggler");
  const menu = document.querySelector("#navbarCollapse");
  const overlay = document.querySelector("#menuOverlay");

  if (!toggler || !menu || !overlay) return;

  function openMenu() {
    menu.classList.add("show");
    overlay.classList.add("active");
    document.body.classList.add("menu-open");
    toggler.classList.add("active");
  }

  function closeMenu() {
    menu.classList.remove("show");
    overlay.classList.remove("active");
    document.body.classList.remove("menu-open");
    toggler.classList.remove("active");
  }

  toggler.addEventListener("click", function () {
    menu.classList.contains("show") ? closeMenu() : openMenu();
  });

  overlay.addEventListener("click", closeMenu);

  document.querySelectorAll("#navbarCollapse .nav-link").forEach(link => {
    link.addEventListener("click", closeMenu);
  });
});

function showStatusPopup(type, title, message) {
  const popup = document.getElementById("statusPopup");
  const icon = document.getElementById("statusIcon");
  const tElem = document.getElementById("statusTitle");
  const mElem = document.getElementById("statusMessage");
  const btn = document.getElementById("statusClose");

  // Reset icon classes
  icon.className = "status-icon";

  if (type === "success") {
    icon.classList.add("success");
    icon.innerHTML = '<i class="fa fa-check"></i>';
  } else if (type === "error") {
    icon.classList.add("error");
    icon.innerHTML = '<i class="fa fa-times"></i>';
  } else {
    icon.classList.add("info");
    icon.innerHTML = '<i class="fa fa-info"></i>';
  }

  tElem.textContent = title || "";
  mElem.textContent = message || "";

  popup.classList.add("show");

  // Close button handler
  btn.onclick = function () {
    popup.classList.remove("show");
  };

  // Click outside to close
  popup.onclick = function (e) {
    if (e.target === popup) {
      popup.classList.remove("show");
    }
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const subject = params.get("subject");

  const selects = [
    document.getElementById("subjectSelect"),
    document.getElementById("sidebarSubjectSelect")
  ];

  selects.forEach(select => {
    if (!select || !subject) return;
    const exists = Array.from(select.options)
      .some(opt => opt.value === subject);
    if (exists) select.value = subject;
  });
});

$(document).ready(function () {

  // Close menu on link click (mobile)
  $('.navbar-nav a:not(.dropdown-toggle)').on('click', function () {
    $('.navbar-collapse').collapse('hide');
  });

});
// Select all testimonial videos
const videos = document.querySelectorAll('.testimonial-video');

videos.forEach(video => {
  video.addEventListener('play', () => {
    // Pause all other videos
    videos.forEach(v => {
      if (v !== video) {
        v.pause();
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {

  const toggle = document.getElementById("programsDropdown");
  const menu = toggle.parentElement.querySelector(".dropdown-menu");

  toggle.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    // toggle only the dropdown menu
    menu.classList.toggle("show");
  });

  // close if clicking outside
  document.addEventListener("click", function () {
    menu.classList.remove("show");
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const fab = document.querySelector(".fab-wrapper");
  const toggle = document.getElementById("fabToggle");

  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    fab.classList.toggle("active");
  });

  // Close drawer when clicking outside
  document.addEventListener("click", function () {
    fab.classList.remove("active");
  });
});

/* ---------------------------------------------------------
   6. FAB (Floating Action Button) TOGGLE
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  const fab = document.querySelector(".fab-wrapper");
  const toggle = document.getElementById("fabToggle");

  toggle.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    fab.classList.toggle("active");
  });

  document.addEventListener("click", function () {
    fab.classList.remove("active");
  });
});



/* ---------------------------------------------------------
   7. Preselect program in forms via URL
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const subject = params.get("subject");

  const selects = [
    document.getElementById("subjectSelect"),
    document.getElementById("sidebarSubjectSelect")
  ];

  selects.forEach(select => {
    if (!select || !subject) return;
    const exists = Array.from(select.options).some(opt => opt.value === subject);
    if (exists) select.value = subject;
  });
});
