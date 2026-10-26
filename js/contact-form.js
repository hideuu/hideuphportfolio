const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const sendButton = document.getElementById("send-message-button");

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  sendButton.disabled = true;
  formStatus.textContent = "Sending...";

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(contactForm),
    });
    const data = await response.json();

    formStatus.textContent = data.message;
    if (data.success) contactForm.reset();
  } catch (error) {
    formStatus.textContent = "Network error. Please try again.";
  } finally {
    sendButton.disabled = false;
  }
});

// shows a message after a no-JavaScript submit redirects back here
const status = new URLSearchParams(window.location.search).get("status");
if (status === "sent") formStatus.textContent = "Message sent. I'll reply soon.";
if (status === "error") formStatus.textContent = "Something went wrong. Please try again.";