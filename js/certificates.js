const modal = document.getElementById("cert-modal");
const modalTitle = document.getElementById("cert-modal-title");
const modalBody = document.getElementById("cert-modal-body");
const closeButton = document.getElementById("cert-modal-close");

function openModal(card) {
    modalTitle.textContent = card.querySelector("h2").textContent;
    modalBody.replaceChildren(
        ...[...card.querySelectorAll(".cert-set .cert-item")].map((item) => item.cloneNode(true))
    );
    document.body.style.overflow = "hidden";
    modal.showModal();
}

document.querySelectorAll(".cert-card").forEach((card) => {
    card.addEventListener("click", () => openModal(card));
    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(card);
        }
    });
});

closeButton.addEventListener("click", () => modal.close());

// click on the dark backdrop closes it
modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
});

// also runs when closed with Escape
modal.addEventListener("close", () => {
    document.body.style.overflow = "";
});