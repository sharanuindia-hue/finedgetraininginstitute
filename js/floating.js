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

document.addEventListener("DOMContentLoaded", function () {
  const toggler = document.querySelector(".navbar-toggler");
  const menu = document.getElementById("navbarCollapse");

  if (!toggler || !menu) return;

  toggler.addEventListener("click", function () {
    setTimeout(() => {
      if (menu.classList.contains("show")) {
        document.body.classList.add("menu-open");
      } else {
        document.body.classList.remove("menu-open");
      }
    }, 50);
  });

  /* Close menu when clicking any link */
  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
    });
  });
});