/* ---------------------------------------------------------
   1. RAZORPAY PAYMENT HANDLER
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {

  const GST_RATE = 0.18;

  const baseInput  = document.getElementById("payBaseAmount");
  const gstInput   = document.getElementById("payGST");
  const totalInput = document.getElementById("payTotal");
  const payBtn     = document.getElementById("payNowBtn");

  if (!baseInput || !payBtn) return;

  function calculate() {
    const base = Number(baseInput.value || 0);
    const gst  = Math.round(base * GST_RATE);
    const total = base + gst;

    gstInput.value   = gst.toLocaleString("en-IN");
    totalInput.value = total.toLocaleString("en-IN");

    return total;
  }

  calculate();
  baseInput.addEventListener("input", calculate);

  payBtn.addEventListener("click", async () => {

    const totalAmount = calculate();

    if (totalAmount < 500) {
      alert("Minimum payable amount is ₹500");
      return;
    }

    payBtn.disabled = true;
    payBtn.innerText = "Processing...";

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount })
      });

      const order = await res.json();
      if (!order.id) throw new Error("Order creation failed");

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
            alert("✅ Payment successful");
            window.location.href = "Thank-you.html";
          } else {
            alert("❌ Payment verification failed");
          }
        },

        modal: {
          ondismiss: () => {
            payBtn.disabled = false;
            payBtn.innerText = "Pay Now";
          }
        }
      };

      new Razorpay(options).open();

    } catch (err) {
      console.error(err);
      alert("Payment initiation failed");
      payBtn.disabled = false;
      payBtn.innerText = "Pay Now";
    }
  });

});

// -----------------------------
const baseInput = document.getElementById("payBaseAmount");
const gstInput  = document.getElementById("payGST");
const totalInput = document.getElementById("payTotal");

function updatePayment() {
  const base = Number(baseInput.value || 0);
  const gst = Math.round(base * 0.18);
  gstInput.value = gst;
  totalInput.value = base + gst;
}

baseInput?.addEventListener("input", updatePayment);
updatePayment();
/* ---------------------------------------------------------
End razorpay
--------------------------------------------------------- */



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
