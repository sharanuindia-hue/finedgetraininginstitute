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
