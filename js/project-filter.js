const buttons = document.querySelectorAll(".filter-button");
const cards = document.querySelectorAll(".projects-container .project-cards");
const emptyMessage = document.getElementById("filter-empty");

buttons.forEach((button) => {
    button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    buttons.forEach((b) => {
        const isActive = b === button;
        b.classList.toggle("active", isActive);
        b.setAttribute("aria-pressed", String(isActive));
    });

    let shown = 0;
    cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category.split(" ").includes(filter);
        card.hidden = !match;
        if (match) shown++;
    });

    emptyMessage.hidden = shown > 0;
    });
});