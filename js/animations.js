document.addEventListener("DOMContentLoaded", () => {
  const revealTargets = document.querySelectorAll(
    ".project-cards, .skill-category, .education-item, .github__panel, .contact-form, .contact-info-container"
  );

  revealTargets.forEach((element) => {
    const index = Array.from(element.parentElement.children).indexOf(element);
    element.style.setProperty("--delay", `${Math.min(index * 100, 400)}ms`);
    element.classList.add("reveal");
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((element) => revealObserver.observe(element));
});