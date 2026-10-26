const projectModal = document.getElementById("project-modal");
const projectModalTitle = document.getElementById("project-modal-title");
const projectModalBody = document.getElementById("project-modal-body");
const projectModalClose = document.getElementById("project-modal-close");

function openProjectModal(card) {
    projectModalTitle.textContent = card.querySelector("h2").textContent;

    // copy the parts of the card we want in the modal
    const image = card.querySelector(".project-img").cloneNode(true);
    image.className = "projects-modal-image";
    image.removeAttribute("loading");

    const details = card.querySelector(".projects-card-details").cloneNode(true);
    details.hidden = false;
    details.className = "projects-modal-details";

    const capsules = card.querySelector(".capsule-container").cloneNode(true);
    const links = card.querySelector(".link-container").cloneNode(true);

    projectModalBody.replaceChildren(image, capsules, details, links);

    document.body.style.overflow = "hidden";
    projectModal.showModal();
}

document.querySelectorAll(".projects-card-clickable").forEach((card) => {
    card.addEventListener("click", (event) => {
        // let the Live Demo / Source Code links work normally
        if (event.target.closest("a")) return;
        openProjectModal(card);
    });

    card.addEventListener("keydown", (event) => {
        // only when the card itself is focused, not a link inside it
        if (event.target !== card) return;
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openProjectModal(card);
        }
    });
});

projectModalClose.addEventListener("click", () => projectModal.close());

// click on the dark backdrop closes it
projectModal.addEventListener("click", (event) => {
    if (event.target === projectModal) projectModal.close();
});

// also runs when closed with Escape
projectModal.addEventListener("close", () => {
    document.body.style.overflow = "";
});