const popupForm = document.getElementById("contact-popup-form");

popupForm?.addEventListener("submit", async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(popupForm));

  const res = await fetch("/api/contact-form", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(r => r.json());

  if (res.success) {
    window.location.href = "/thank-you.html";
  } else {
    alert("Submission failed");
  }
});
