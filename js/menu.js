document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navButtons = document.getElementById("nav-buttons");

  function setMenu(open) {
    navButtons.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    // the menu/X icon swap is done in style.css with [aria-expanded="true"]
  }

  menuToggle.addEventListener("click", () => {
    setMenu(!navButtons.classList.contains("open"));
  });

  // close the menu after tapping a link
  navButtons.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  // close with the Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  // reset when the window grows back to desktop size
  window.matchMedia("(min-width: 769px)").addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });
});