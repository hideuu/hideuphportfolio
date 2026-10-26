// Builds an image carousel from a list of <figure> elements (each with an <img> and an optional <figcaption>).
// Used by the project modal (projects.html) and the certificate modal (about.html).
function buildCarousel(figures) {
    const carousel = document.createElement("div");
    carousel.className = "carousel";

    const track = document.createElement("div");
    track.className = "carousel-track";

    figures.forEach((figure) => {
        const slide = figure.cloneNode(true);
        slide.classList.add("carousel-item");
        slide.querySelector("img")?.removeAttribute("loading");
        track.appendChild(slide);
    });

    carousel.appendChild(track);

    // one image: no buttons or dots needed
    if (figures.length < 2) return carousel;

    const controls = document.createElement("div");
    controls.className = "carousel-controls";
    controls.innerHTML = `
        <button type="button" class="carousel-button" data-step="-1" aria-label="Previous image">&larr;</button>
        <span class="carousel-counter" aria-live="polite"></span>
        <button type="button" class="carousel-button" data-step="1" aria-label="Next image">&rarr;</button>
    `;

    const dots = document.createElement("div");
    dots.className = "carousel-dots";
    figures.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", `Go to image ${i + 1}`);
        dot.addEventListener("click", () => goTo(i));
        dots.appendChild(dot);
    });

    carousel.append(controls, dots);

    const prevButton = controls.querySelector('[data-step="-1"]');
    const nextButton = controls.querySelector('[data-step="1"]');
    const counter = controls.querySelector(".carousel-counter");
    let current = 0;

    function goTo(index) {
        const target = Math.max(0, Math.min(index, figures.length - 1));
        track.scrollTo({ left: target * track.clientWidth, behavior: "smooth" });
    }

    function update() {
        current = Math.round(track.scrollLeft / track.clientWidth) || 0;
        counter.textContent = `${current + 1} / ${figures.length}`;
        prevButton.disabled = current === 0;
        nextButton.disabled = current === figures.length - 1;
        dots.querySelectorAll(".carousel-dot").forEach((dot, i) => {
            dot.classList.toggle("active", i === current);
            dot.setAttribute("aria-current", i === current ? "true" : "false");
        });
    }

    prevButton.addEventListener("click", () => goTo(current - 1));
    nextButton.addEventListener("click", () => goTo(current + 1));

    // swiping or scrolling the track also updates the counter and dots
    track.addEventListener("scroll", update, { passive: true });

    // used by the arrow-key handler below
    carousel.carouselStep = (step) => goTo(current + step);

    update();
    return carousel;
}

// left/right arrow keys move the carousel inside whichever modal is open
document.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const carousel = document.querySelector("dialog[open] .carousel");
    if (!carousel || !carousel.carouselStep) return;
    event.preventDefault();
    carousel.carouselStep(event.key === "ArrowLeft" ? -1 : 1);
});