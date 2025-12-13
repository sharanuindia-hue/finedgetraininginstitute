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

  // initial GST calculation
  calculate();

  baseInput.addEventListener("input", calculate);

  // 🔹 Enable button only when form is valid
  function togglePayButton() {
    payButton.disabled = !form.checkValidity();
  }

  // listen to all inputs
  form.addEventListener("input", togglePayButton);
  form.addEventListener("change", togglePayButton);

  // initial check
  togglePayButton();

  // Razorpay flow
  payButton.addEventListener("click", async () => {

    // Final safety check
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
document.getElementById("applyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  const params = Object.fromEntries(formData.entries());

  // ADMIN EMAIL
  emailjs.send("service_724c1ef", "template_n5mq7jd", params)

    .then(() => {
      // AUTO-REPLY
      return emailjs.send(
        "service_724c1ef",
        "template_n5mq7jd",
        params
      );
    })

    .then(() => {
      alert("Application submitted successfully. Check your email.");
      document.getElementById("applyForm").reset();
    })

    .catch(err => {
      console.error("APPLY FORM ERROR", err);
      alert("Submission failed. Please try again.");
    });
});



/* ---------------------------------------------------------
   3. CONTACT FORM (EmailJS)
--------------------------------------------------------- */
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const params = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message")
  };

  const btn = this.querySelector("button");
  btn.disabled = true;
  btn.innerText = "Sending...";

  // ADMIN EMAIL
  emailjs.send(
    "service_724c1ef",
    "template_rohr2r4",
    params
  )
  .then(() => {
    // AUTO-REPLY
    return emailjs.send(
      "service_724c1ef", "template_rohr2r4",
      params
    );
  })
  .then(() => {
    alert("Thank you! We will contact you soon.");
    document.getElementById("contactForm").reset();
  })
  .catch(err => {
    console.error("CONTACT FORM ERROR", err);
    alert("Message failed. Try again.");
  })
  .finally(() => {
    btn.disabled = false;
    btn.innerText = "Send Message";
  });
});




/* ---------------------------------------------------------
   4. NEWSLETTER FORM (EmailJS)
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  const newsletterForm = document.getElementById("newsletterForm");
  if (!newsletterForm) return;

  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = this.email.value.trim();
    if (!email) {
      alert("Please enter a valid email.");
      return;
    }

    emailjs.send("service_724c1ef", "template_rohr2r4", { subscriber_email: email })
      .then(() => {
        alert("Subscribed successfully!");
        newsletterForm.reset();
      })
      .catch(err => {
        alert("Subscription failed.");
        console.error("Newsletter Error:", err);
      });
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