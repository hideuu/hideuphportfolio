const systemQuery = window.matchMedia("(prefers-color-scheme: light)");

let savedTheme = null;
try {
  savedTheme = localStorage.getItem("theme");
} catch (error) {}

function getSystemTheme() {
  return systemQuery.matches ? "light" : "dark";
}

const initialTheme = savedTheme || getSystemTheme();
document.documentElement.setAttribute("data-theme", initialTheme);

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");

  // the sun/moon icon swap is done in style.css with [data-theme="light"] #theme-icon
  function updateToggle(theme) {
    themeToggle.setAttribute(
      "aria-label",
      theme === "light" ? "Switch to dark mode" : "Switch to light mode"
    );
  }

  updateToggle(initialTheme);

  // clicking the button saves the choice, so it overrides the system setting from now on
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (error) {}
    updateToggle(next);
  });

  // if the visitor never clicked the button, follow their system when it changes
  systemQuery.addEventListener("change", () => {
    let hasSavedChoice = null;
    try {
      hasSavedChoice = localStorage.getItem("theme");
    } catch (error) {}
    if (hasSavedChoice) return;

    const systemTheme = getSystemTheme();
    document.documentElement.setAttribute("data-theme", systemTheme);
    updateToggle(systemTheme);
  });
});