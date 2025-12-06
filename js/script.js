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
document.addEventListener('DOMContentLoaded', function () {

  async function attachRazorpayHandler(buttonId, requireFormValidation = false) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;

    btn.addEventListener('click', async function (e) {
      e.preventDefault();

      let amountInRupees = 1000; // default fallback

      // If this button is the modal one, ensure form is valid first
      if (requireFormValidation) {
        const applyForm    = document.getElementById("applyForm");
        const amountField  = document.getElementById("dynamicAmount");

        if (!applyForm || !amountField) {
          showStatusPopup(
            "error",
            "Form Not Found",
            "Please open the admission form and try again."
          );
          return;
        }

        // Trigger HTML5 built-in validation
        const isValid = applyForm.reportValidity();
        if (!isValid) {
          // Browser will highlight invalid fields
          return;
        }

        // Get amount from input
        amountInRupees = parseFloat(amountField.value);
        if (isNaN(amountInRupees) || amountInRupees <= 0) {
          showStatusPopup(
            "error",
            "Invalid Amount",
            "Please enter a valid program fee amount (in ₹) before proceeding to payment."
          );
          return;
        }
      }

      try {
        // 1️⃣ CREATE ORDER (BACKEND)
        const orderRes = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: amountInRupees })
        });

        const order = await orderRes.json();

        if (!order || !order.id) {
          console.error("Order response:", order);
          showStatusPopup(
            "error",
            "Order Failed",
            "We couldn’t start the payment right now. Please try again in a moment."
          );
          return;
        }

        // 2️⃣ RAZORPAY CHECKOUT OPTIONS
        const options = {
          key: "rzp_live_RjGNUSpVFIuRog", // your LIVE key
          amount: order.amount,
          currency: order.currency,
          name: "FINEDGE Training Institute",
          description: "BFSI Job Accelerator Program",
          order_id: order.id,

          handler: async function (response) {
            // 3️⃣ VERIFY PAYMENT (BACKEND)
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyData.verified) {
              showStatusPopup(
                "success",
                "Payment Successful 🎉",
                "Your payment is verified. Payment ID: " + verifyData.paymentId
              );
              // Optional redirect:
              // window.location.href = "/thank-you.html";
            } else {
              showStatusPopup(
                "error",
                "Verification Failed",
                "We received your payment but could not verify it. Please contact the institute with your Payment ID."
              );
            }
          },

          theme: { color: "#007bff" }
        };

        const rzp = new Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error(err);
        showStatusPopup(
          "error",
          "Something Went Wrong",
          "We couldn’t start the payment. Please check your internet connection and try again."
        );
      }
    });
  }

  // ✅ Only Option 1: payment via Apply Form button
  attachRazorpayHandler('payButtonApply', true);

  // If you want navbar Pay button JUST to open the form:
  const navPay = document.getElementById("payButton");
  if (navPay) {
    navPay.addEventListener("click", function (e) {
      e.preventDefault();
      $('#applyModal').modal('show'); // Bootstrap modal
    });
  }
});




/* ---------------------------------------------------------
   3. CONTACT FORM (EmailJS)
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(contactForm);

    const templateParams = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message")
    };

    const submitBtn = contactForm.querySelector("button[type='submit']");
    const originalText = submitBtn.innerText;
    submitBtn.disabled = true;
    submitBtn.innerText = "Sending...";

    emailjs.send("service_724c1ef", "template_rohr2r4", templateParams)
      .then(() => {
        alert("Thank you! Your message has been sent.");
        contactForm.reset();
      })
      .catch(err => {
        console.error("CONTACT FAILED", err);
        alert("Unable to send message. Try again.");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;
      });
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

