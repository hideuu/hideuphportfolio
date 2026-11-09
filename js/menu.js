document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navButtons = document.getElementById("nav-buttons");

  function setMenu(open) {
    navButtons.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    // CSS selects the icon from aria-expanded.
  }

  menuToggle.addEventListener("click", () => {
    setMenu(!navButtons.classList.contains("open"));
  });

  navButtons.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  // Clear mobile menu state when returning to desktop.
  window.matchMedia("(min-width: 769px)").addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });
});