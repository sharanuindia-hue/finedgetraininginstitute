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
document.addEventListener("DOMContentLoaded", function () {
  const applyForm = document.getElementById("applyForm");

  applyForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!applyForm.checkValidity()) {
      applyForm.reportValidity();
      return;
    }

    const formData = new FormData(applyForm);
    const params = Object.fromEntries(formData.entries());

    // Admin email
    const adminParams = {
      ...params,
      subject: "🎓 New Program Application",
      message: `
New application received:
Name: ${params.name}
Email: ${params.email}
Phone: ${params.phone}
Program: ${params.program}
Message: ${params.message}`
    };

    // User email
    const userParams = {
      name: params.name,
      email: params.email,
      subject: "Application Received – Finedge",
      message: `Hi ${params.name},\n\nThank you for applying for ${params.program}. Our team will review and contact you shortly.`
    };

    emailjs.send("service_724c1ef", "template_n5mq7jd", adminParams)
      .then(() => emailjs.send("service_724c1ef", "template_n5mq7jd", userParams))
      .then(() => {
        window.location.href = "Thank-you.html";
      })
      .catch(err => {
        console.error("APPLY ERROR", err);
        alert("Application failed. Please try again.");
      });
  });
});

/* ---------------------------------------------------------
   3. CONTACT FORM (EmailJS)
--------------------------------------------------------- */
// ---------------- Contact Form Submission ----------------
document.addEventListener("DOMContentLoaded", function () {
  const forms = [
    document.getElementById("contact-form"),
    document.getElementById("contact-form-pop"),
    
  ];

  forms.forEach(form => {
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const params = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        program: formData.get("program"),
        subject: "New Contact Enquiry",
        message: `
Program Interested: ${formData.get("program")}
Message: ${formData.get("message")}
        `
      };

      const btn = form.querySelector("button");
      btn.disabled = true;
      btn.innerText = "Sending...";

      emailjs.send("service_724c1ef", "template_rohr2r4", params)
        .then(() => {
          // Close modal if it's modal form
          const modal = form.closest(".modal");
          if (modal) $(modal).modal("hide");

          // Redirect to Thank You page
          window.location.href = "thank-you.html";
        })
        .catch(err => {
          console.error("CONTACT FORM ERROR:", err);
          alert("Submission failed. Please try again.");
        })
        .finally(() => {
          btn.disabled = false;
          btn.innerText = "Request Call Back";
        });
    });
  });
});


/* ---------------------------------------------------------
   4. OTP FOR BROCHURE DOWNLOAD
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  const sendOtpBtn = document.getElementById("sendOtpBtn");
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");

  sendOtpBtn?.addEventListener("click", function () {
    const name = document.getElementById("brochureName").value.trim();
    const email = document.getElementById("brochureEmail").value.trim();
    const phone = document.getElementById("brochurePhone").value.trim();

    if (!name || !email || !phone) {
      alert("Please fill all fields");
      return;
    }

    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", generatedOTP);

    emailjs.send("service_724c1ef", "template_rohr2r4", { name, email, otp: generatedOTP })
      .then(() => {
        alert("OTP sent to your email");
        document.getElementById("otpVerifySection").classList.remove("d-none");
      })
      .catch(err => {
        console.error(err);
        alert("Failed to send OTP");
      });
  });

  verifyOtpBtn?.addEventListener("click", function () {
    const enteredOtp = document.getElementById("otpInput").value.trim();

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

    const name  = document.getElementById("brochureName").value.trim();
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
    const popup  = document.getElementById("statusPopup");
    const icon   = document.getElementById("statusIcon");
    const tElem  = document.getElementById("statusTitle");
    const mElem  = document.getElementById("statusMessage");
    const btn    = document.getElementById("statusClose");

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

  if (!fab || !toggle) return;

  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    fab.classList.toggle("active");
  });

  fab.addEventListener("click", function (e) {
    e.stopPropagation();
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
