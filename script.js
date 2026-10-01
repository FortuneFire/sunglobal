const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const navDropdown = document.querySelector(".nav-dropdown");

/* =========================
   Mobile Navigation
========================= */

menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    navDropdown?.classList.remove("open");
  });
});

/* =========================
   Mobile Solutions Dropdown
========================= */

document.querySelectorAll(".dropdown-toggle").forEach((toggle) => {
  toggle.addEventListener("click", (event) => {
    if (window.innerWidth > 760) return;

    event.preventDefault();

    const parent = toggle.closest(".nav-dropdown");

    if (!parent) return;

    const open = parent.classList.toggle("open");

    toggle.setAttribute("aria-expanded", String(open));
  });
});

/* Close dropdown when clicking outside */

document.addEventListener("click", (event) => {
  if (!navDropdown?.contains(event.target)) {
    navDropdown?.classList.remove("open");
  }
});

/* =========================
   Hero Slider
========================= */

const heroSlides = [...document.querySelectorAll(".hero-slide")];

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (heroSlides.length > 1 && !reducedMotion) {
  let activeHeroSlide = 0;

  window.setInterval(() => {
    heroSlides[activeHeroSlide].classList.remove("is-active");

    activeHeroSlide =
      (activeHeroSlide + 1) % heroSlides.length;

    heroSlides[activeHeroSlide].classList.add("is-active");
  }, 7000);
}

/* =========================
   Active Navigation
========================= */

const currentPage =
  window.location.pathname.split("/").pop() || "index.html";

const solutionPages = [
  "protection.html",
  "investments.html",
  "retirement.html",
  "structured-investments.html"
];

document
  .querySelectorAll(".main-nav a[data-page]")
  .forEach((link) => {
    const page = link.dataset.page || "";

    const shouldHighlight =
      page === currentPage ||
      (
        solutionPages.includes(currentPage) &&
        link.classList.contains("dropdown-toggle")
      );

    if (shouldHighlight) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

/* =========================
   Consultation Form
========================= */

const form = document.getElementById("consultationForm");
const message = document.querySelector(".form-message");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = form.querySelector(
    'button[type="submit"]'
  );

  if (!message || !submitButton) return;

  /* Use browser's built-in validation */

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);

  const name =
    formData.get("name")?.toString().trim() || "there";

  /* Prevent duplicate submissions */

  submitButton.disabled = true;

  const originalButtonText = submitButton.textContent;

  submitButton.textContent = "Sending...";

  message.textContent =
    "Sending your consultation request...";

  message.classList.remove("error", "success");

  try {
    const response = await fetch("/api/submit-form.php", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message ||
        "We couldn't submit your request."
      );
    }

    message.textContent =
      `Thank you, ${name}. Your consultation request has been received.`;

    message.classList.add("success");
    message.classList.remove("error");

    form.reset();

  } catch (error) {
    console.error(
      "Consultation form error:",
      error
    );

    message.textContent =
      "Sorry, we couldn't send your request. Please try again or contact Sun Global directly.";

    message.classList.add("error");
    message.classList.remove("success");

  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});

/* =========================
   Footer Year
========================= */

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}